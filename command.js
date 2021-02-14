const { PREFIX } = process.env.NODE_ENV === 'production' ? process.env : require('./config.json')

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string') {
        aliases = [aliases]
    }

    client.on('message', message => {
        const { content } = message

        aliases.forEach(alias => {
            const command = `${PREFIX}${alias}`

            if (content.startsWith(`${command} `) || content == command) {
                console.log(`Running the command ${command}`)
                callback(message)
            }
        })
    })
}