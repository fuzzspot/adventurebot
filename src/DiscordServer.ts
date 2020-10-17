import Discord, { RichEmbed } from 'discord.js'
import { logger } from 'utility/logger'
import fs from 'fs'

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

      const command = content.split(' ')[0].split(this.prefix)[1]
      const data = content.split(this.prefix + command)[1].trim().split(' ')
      let valid = false
      const embed = new RichEmbed()
        .setColor('GREEN')

      if (command === 'list') {
        valid = true
        embed.setTitle('Available Stories')

        const storiesObj = this.stories
        Object.keys(storiesObj).forEach(function (key) {
          embed.addField(key, storiesObj[key].join('\n'))
        })
      }

      if (command === 'help') {
        valid = true
        embed.setTitle('Lists all the bots commands')
          .addField(`${this.prefix}play x`, 'Starts the specified story ( x ) in PMs')
          .addField(`${this.prefix}help`, 'Displays this help command')
          .addField(`${this.prefix}list`, 'Lists all available stories')
      }

      if (command === 'play') {
        valid = true
        embed.setTitle('Start story')
        embed.setDescription(`Starting story: ${data}`)
      }

      if (valid) {
        msg.channel.send(embed).catch(e => {
          logger.log('error', e.message, ...[e])
        })
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
}
