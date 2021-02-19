const { PREFIX } = process.env.NODE_ENV === 'production' ? process.env : require('../../config.json')

module.exports = (client, aliases, callback, noParam=false, dmOnly=true) => {
    if (typeof aliases === 'string') {
        aliases = [aliases]
    }

    client.on('message', message => {
        const { content } = message

        let trimmedContent = message.content.split(" ").splice(1)
        trimmedContent = trimmedContent.length > 1 ? trimmedContent.join(" ") : trimmedContent[0]
        
        if (!noParam && trimmedContent === undefined) {
            message.author.send("Command not recognized. Did you forget to include a message after ![COMMAND]?")
            return
        }
        
        aliases.forEach(alias => {
            const command = `${PREFIX}${alias}`
            if (content.startsWith(`${command} `) || content === command) {
                if (dmOnly && message.channel.type === 'dm') {
                    noParam ? callback(message) : callback(client, message, trimmedContent)
                } else if (!dmOnly && message.channel.type !== 'dm') {
                    noParam ? callback(message) : callback(client, message, trimmedContent)
                }
            }
        })
    })
}