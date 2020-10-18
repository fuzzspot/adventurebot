import { RichEmbed, Message } from 'discord.js'
import { DiscordServer } from 'DiscordServer'
import { logger } from 'utility/logger'
import { getUserStory } from 'models/commands/getUserStory'
import { loadPage } from 'models/commands/loadPage'
import { startStory } from 'models/commands/startStory'

export default async function execute (message: Message, data: string): Promise<void> {
  try {
    const msg = message
    const currentStory = await getUserStory(msg.author.id)
    const storyObj = await loadPage(currentStory.story)
    const options: any = storyObj.options
    const objectMatch = Object.keys(options).find(key => key.toLowerCase() === data.toLowerCase())
    const embed = new RichEmbed()
      .setColor('ORANGE')

    if (objectMatch == null) {
      if (Object.keys(options).length > 0) {
        const compressed: any[] = []

        Object.keys(options).forEach(function (key) {
          compressed.push(key)
        })

        embed.setTitle('Option not found')
          .setDescription('Couldn\'t find option in list')
          .addField('Options', compressed.join('\n'))

        msg.channel.send(embed).catch(e => {
          logger.log('error', e.message, ...[e])
        })
      }
    } else {
      startStory(message.author.id, `${options[objectMatch]}`).catch(e => {
        logger.log('error', e.message, ...[e])
      })

      console.log(options[objectMatch])
      console.log('firing')

      loadPage(options[objectMatch]).then((doc: {_id: string, story: string, page: string, text: string, options: object}) => {
        const name = doc.story
        const options: any[] = []

        Object.keys(doc.options).forEach(function (key) {
          options.push(key)
        })

        const story = new RichEmbed()
          .setColor('ORANGE')
          .setTitle(`${name.split('/')[1]} by ${name.split('/')[0]}`)
          .setDescription(doc.text)
          .setFooter(`Page: ${doc.page}`)

        if (options.join('\n').length > 0) {
          story.addField('Options', options.join('\n'))
        }

        message.author.send(story).catch(e => {
          logger.log('error', e.message, ...[e])
        })
      }).catch(e => {
        logger.log('error', e.message, ...[e])
      })
    }
  } catch (e) {
    logger.log('error', e.message, ...[e])
  }
}
