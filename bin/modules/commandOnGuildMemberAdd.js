module.exports = client => {
    const channelID = '811236649764782110'

    client.on('guildMemberAdd', member => {
        // client.channels.cache.get('811236649764782110').send(message)
        console.log(member)
        // const message = `Please welcome <@${member.id} to the server`

    })
}