const getTime = () => {
    const today = new Date()
    return today.getHours() + ':' + ('0' + today.getMinutes()).slice(-2) + ':' + ('0' + today.getSeconds()).slice(-2)
}

// const capitalize = input => input.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))

const clear = message => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.messages.fetch().then(results => {
            message.channel.bulkDelete(results)
        })
    }
}

const testSendChannel = async (client, message) => {
    // console.log(message.channel.recipient.id)
     await client.guilds.cache.get('809336749977239572').members.fetch(message.channel.recipient.id).then(res => console.log(res))
    // client.channels.cache.get('811236649764782110').send('Test')
}

const assignRole = () => {

}

const sendAnswer = async (client, message, trimmedContent) => {
    let nickname
    await client.guilds.cache.get('809336749977239572').members.fetch(message.channel.recipient.id).then(res => nickname = res.nickname)
    client.channels.cache.get('811206212782653440').send(`${getTime()} - **${nickname}** : ${trimmedContent}`)
}

const sendRolePoll = (message, trimmedContent) => {
    client.channels.fetch('811236649764782110').send('Test')
}

exports.clear = clear
exports.testSendChannel = testSendChannel
exports.sendAnswer = sendAnswer