const prefix = process.env.PREFIX

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string') {
        aliases = [aliases]
    }

    clients.on('message', message => {
        const { content } = message

        aliases.forEach(alias => {
            const command = `${prefix}${alias}`

            if (content.startWith(`${command} `) || content == command) {
                console.log(`Running the command ${command}`)
                callback(message)
            }
        })
    })
}