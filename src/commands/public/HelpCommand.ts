import { RichEmbed, Message } from 'discord.js'
import { DiscordServer } from 'DiscordServer'
import { logger } from 'utility/logger'

/**
 * List the help command
 *
 * @param message
 * @param _data
 */
export default function execute (message: Message, _data?: string): void {
  const prefix = DiscordServer.getInstance().getPrefix()

  const embed = new RichEmbed()
    .setColor('GREEN')
  embed.setTitle('Lists all the bots commands')
    .addField(`${prefix}play x`, 'Starts the specified story ( x ) in PMs')
    .addField(`${prefix}help`, 'Displays this help command')
    .addField(`${prefix}list`, 'Lists all available stories')

  message.channel.send(embed).catch(e => {
    logger.log('error', e.message, ...[e])
  })
}
