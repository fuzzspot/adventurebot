import { RichEmbed, Message } from 'discord.js'
import { DiscordServer } from 'DiscordServer'
import { logger } from 'utility/logger'
import { startStory } from 'models/commands/startStory'

export default function execute (message: Message, data: string): void {
  const prefix = DiscordServer.getInstance().getPrefix()
  const knownAuthors: any[] = DiscordServer.getInstance().getAuthors()
  const embed = new RichEmbed()
    .setColor('GREEN')

  embed.setTitle('Start story')

  let requestedAuthor = ''
  let requestedStory = data

  if (data.includes('/')) {
    requestedAuthor = data.split('/')[0]
    requestedStory = data.split('/')[1]
  }

  if (requestedAuthor !== '' && !knownAuthors.includes(requestedAuthor)) {
    embed.setTitle('Author not found!')
    embed.setDescription(`Please check your spelling and try again! Type \`${prefix}list\` to list all available stories`)
  }

  let storyExists = false
  let multipleStories = false
  let author = ''
  const storiesObj = DiscordServer.getInstance().getStories()
  Object.keys(storiesObj).forEach(function (key) {
    storiesObj[key].forEach((story: string) => {
      if (requestedStory === story) {
        if (storyExists) {
          multipleStories = true
        }
        storyExists = true
        author = key
      }
    })
  })

  if (storyExists) {
    if (!multipleStories) {
      embed.setDescription(`Starting **${data}** by **${author}**! Stories are played in DM, I'll send you a message in just a second!`)

      message.author.send('Hi!').catch(e => {
        logger.log('error', e.message, ...[e])
      })

      startStory(message.author.id, `${author}/${data}`).catch(e => {
        logger.log('error', e.message, ...[e])
      })
    } else {
      embed.setTitle('Multiple stories found!')
      embed.setDescription(`We found multiple stories of the same name. To specify an exact story, please type \`${prefix}play author/story\`. Example: \`${prefix}play example/the cave\``)
    }
  } else {
    embed.setTitle('Story not found!')
    embed.setDescription(`Please check your spelling and try again! Type \`${prefix}list\` to list all available stories`)
  }

  message.channel.send(embed).catch(e => {
    logger.log('error', e.message, ...[e])
  })
}
