const { PREFIX } = process.env.NODE_ENV === 'production' ? process.env : require('../../config.json')

module.exports = (client, aliases, callback, noParam=false) => {
    if (typeof aliases === 'string') {
        aliases = [aliases]
    }

    client.on('message', message => {
        const { content } = message
        let trimmedContent = message.content.split(" ").splice(1)
        trimmedContent = trimmedContent.length > 1 ? trimmedContent.join(" ") : trimmedContent[0]
        
        aliases.forEach(alias => {
            const command = `${PREFIX}${alias}`
            if ((content.startsWith(`${command} `) || content === command)) {
                if (!noParam && trimmedContent === undefined) {
                    message.author.send("Command not recognized. Did you forget to include a message after ![COMMAND]")
                    return
                }
                noParam ? callback(client, message) : callback(client, message, trimmedContent)
            }
        })
    })
}