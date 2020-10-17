import Discord from 'discord.js'
import { logger } from 'utility/logger'
import fs from 'fs'
import HelpCommand from 'commands/public/HelpCommand'
import ListCommand from 'commands/public/ListCommand'
import PlayCommand from 'commands/public/PlayCommand'

interface TextObject {
  [key: string]: any
}

export class DiscordServer {
  private static instance: DiscordServer
  private readonly client: Discord.Client
  private readonly prefix: string
  private readonly channels: TextObject
  private stories: TextObject
  private authors: any[]
  private guild: Discord.Guild | undefined

  private constructor () {
    this.client = new Discord.Client()
    this.prefix = process.env.BOT_PREFIX ?? '??'
    this.channels = {}
    this.authors = []
    this.stories = {}
    this.login()
  }

  /**
   * Return our class for singleton init
   */
  public static getInstance (): DiscordServer {
    if (DiscordServer.instance == null) {
      DiscordServer.instance = new DiscordServer()
    }

    return DiscordServer.instance
  }

  /**
   * Login to discord bot
   */
  private login (): void {
    this.client.login(process.env.BOT_TOKEN).then(() => {
      this.catchError()
      this.linkChannels()
      this.linkGuild()
      this.loadAuthors()
      this.loadStories()
      this.messageListener()
    }).catch(e => {
      logger.log('error', e.message)
    })
  }

  /**
   * Listen for messages
   */
  private messageListener (): void {
    this.client.on('message', msg => {
      const content = msg.content

      if (!content.startsWith(this.prefix)) return false
      if (msg.channel.id !== this.channels.CHANNEL_BOT.id && msg.channel.type !== 'dm') return false

      const command = content.split(' ')[0].split(this.prefix)[1]
      const data = content.split(this.prefix + command)[1].trim()

      if (command === 'list') {
        ListCommand(msg, data)
      }

      if (command === 'help') {
        console.log('firing')
        HelpCommand(msg, data)
      }

      if (command === 'play' && data.length > 0) {
        PlayCommand(msg, data)
      }

      return true
    })
  }

  /**
   * Link all channels to a DiscordChannel
   * object for use in our modules
   */
  private linkChannels (): void {
    for (const property in process.env) {
      if (property.includes('CHANNEL')) {
        const channelId = process.env[property] ?? ''
        this.channels[property] = this.client.channels.get(channelId)
      }
    }
  }

  /**
   * Link our guild
   */
  private linkGuild (): void {
    const guildId = process.env.GUILD ?? ''
    this.guild = this.client.guilds.get(guildId)
  }

  /**
   * Catches and logs discordjs errors
   */
  private catchError (): void {
    this.client.on('error', function (error) {
      logger.log('error', error.message, ...[error])
    })
  }

  private loadAuthors (): void {
    this.authors = this.loadDir()
  }

  private loadStories (): void {
    const stories: TextObject = {}

    this.authors.forEach(author => {
      stories[author] = this.loadDir(author)
    })

    this.stories = stories
  }

  private loadDir (sub: string = ''): any[] {
    const path = `${process.env.PWD}/stories/${sub}`
    const folders = fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path + '/' + file).isDirectory()
    })

    return folders
  }

  public getPrefix (): string {
    return this.prefix
  }

  public getStories (): any {
    return this.stories
  }

  public getAuthors (): any {
    return this.authors
  }
}
