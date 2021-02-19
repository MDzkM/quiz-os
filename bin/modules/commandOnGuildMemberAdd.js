module.exports = (client, callback) => {
    const channelID = '811236649764782110'

    client.on('guildMemberAdd', member => {
        const message = '👋 Hello! I am **Helper OS**, the official guide for **Operating Systems 211** server.\n\n'
        member.send(message)
        callback(client, member)
    })
}