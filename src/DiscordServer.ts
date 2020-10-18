import Discord from 'discord.js'
import { logger } from 'utility/logger'
import fs from 'fs'
import HelpCommand from 'commands/public/HelpCommand'
import ListCommand from 'commands/public/ListCommand'
import PlayCommand from 'commands/public/PlayCommand'
import PlayerCommand from 'commands/direct/PlayerCommand'
import { clearAllStories } from 'models/init/clearAllStories'
import { insertStory } from 'models/init/insertStory'

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
  private readonly dirResolver: string | undefined

  private constructor () {
    this.client = new Discord.Client()
    this.prefix = process.env.BOT_PREFIX ?? '??'
    this.channels = {}
    this.authors = []
    this.stories = {}
    this.login()

    if (process.env.MODE === 'development') {
      this.dirResolver = process.env.PWD
    } else {
      this.dirResolver = process.env.ROOT_FOLDER
    }

    logger.log('info', process.env.MODE)
    logger.log('info', this.dirResolver)
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
      this.clearAllStories()
      this.loadAllStories()
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

      if (msg.channel.type === 'dm') {
        PlayerCommand(msg, content).catch(e => {
          logger.log('error', e.message, ...[e])
        })
      }

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

  /**
   * Loads all authors
   */
  private loadAuthors (): void {
    this.authors = this.loadDir()
  }

  /**
   * Loads all story names
   */
  private loadStories (): void {
    const stories: TextObject = {}

    this.authors.forEach(author => {
      stories[author] = this.loadDir(author)
    })

    this.stories = stories
  }

  /**
   * Loads directory names
   *
   * @param sub options sub directory
   */
  private loadDir (sub: string = ''): any[] {
    const path = `${this.dirResolver}/stories/${sub}`
    const folders = fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path + '/' + file).isDirectory()
    })

    return folders
  }

  /**
   * Return prefix
   */
  public getPrefix (): string {
    return this.prefix
  }

  /**
   * Return current story names
   */
  public getStories (): any {
    return this.stories
  }

  /**
   * Return current authors
   */
  public getAuthors (): any {
    return this.authors
  }

  /**
   * Clear all stories from the DB
   */
  private clearAllStories (): void {
    clearAllStories().catch(e => {
      logger.log('error', e.message, ...[e])
    })
  }

  /**
   * Load all story paths
   */
  private loadAllStories (): void {
    const paths: any[] = []
    Object.keys(this.stories).forEach((key) => {
      var stories = this.stories[key]

      stories.forEach((story: string) => {
        const path = `${this.dirResolver}/stories/${key}/${story}`

        paths.push(...this.getTextPaths(path))
      })
    })

    this.loadStoryText(paths)
  }

  /**
   * Load all story text paths
   *
   * @param directory path to look for text files
   */
  private getTextPaths (directory: string): any[] {
    const paths: any[] = []
    fs.readdirSync(directory).forEach(function (file) {
      paths.push(`${directory}/${file}`)
    })

    return paths
  }

  /**
   * Load all story text and insert into DB
   *
   * @param paths paths to load txt from
   */
  private loadStoryText (paths: any[]): void {
    paths.forEach((path: string) => {
      fs.readFile(path, 'utf8', function (err, data) {
        if (err != null) {
          logger.log('error', err)
        }

        if (data.length > 0 && data != null) {
          var textMatcher = new RegExp(/^((?!\[Options]|\[Text]).)*$/ms)
          var optionMatcher = new RegExp(/(?<=\[Options]\n)(.*)(\n)/ms)

          var textGroup = data.match(textMatcher)
          var optionsGroup = data.match(optionMatcher)

          var text = ''
          var options: TextObject = {}

          if (textGroup != null) {
            text = textGroup[0]

            let raw = path.split(/\/(?=[^/]+$)/)
            const page = raw[1].trim().split('.txt')[0]
            raw = raw[0].split(/\/(?=[^/]+$)/)
            const story = raw[1].trim()
            raw = raw[0].split(/\/(?=[^/]+$)/)
            const author = raw[1].trim()

            if (optionsGroup != null) {
              var optionString = String(optionsGroup[0])
              optionString.split('\n').forEach((option: string) => {
                if (option.length > 1) {
                  options[option.split('=>')[0].trim()] = `${author}/${story}/${option.split('=>')[1].trim().split('.txt')[0]}`
                }
              })
            }

            insertStory(`${author}/${story}/${page}`, `${author}/${story}`, page, text, options).catch(e => {
              logger.log('error', e.message, ...[e])
            })
          }
        }
      })
    })
  }
}
