import { RichEmbed, Message } from 'discord.js'
import { DiscordServer } from 'DiscordServer'
import { logger } from 'utility/logger'

/**
 * List the list command
 *
 * @param message
 * @param _data
 */
export default function execute (message: Message, _data?: string): void {
  const prefix = DiscordServer.getInstance().getPrefix()
  const embed = new RichEmbed()
    .setColor('GREEN')

  embed.setTitle('Available Stories')
    .setDescription(`To start a story, type \`${prefix}play story_name\`. Example: \`${prefix}play the forest\`.`)

  const storiesObj = DiscordServer.getInstance().getStories()
  Object.keys(storiesObj).forEach(function (key) {
    embed.addField(key, storiesObj[key].join('\n'))
  })

  message.channel.send(embed).catch(e => {
    logger.log('error', e.message, ...[e])
  })
}
