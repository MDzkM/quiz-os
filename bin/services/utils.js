const { NODE_ENV } = process.env.NODE_ENV === 'production' ? process.env : require('../../config.json')

const classes = {
    A: '811530070090317834',
    B: '811533539957932064',
    C: '811533545859973142',
}
const assistantCodes = ['EU', 'GSW', 'LY', 'DZ', 'MYM', 'NAD', 'PS', 'MAN', 'TAZ', 'ZB']

// const generateColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`

const capitalize = input => input.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
const hasNumber = input => /\d/.test(input)

const getTime = () => {
    const today = new Date()
    
    const hours = NODE_ENV === 'production' ? (today.getHours() + 7) % 24 : today.getHours()
    const minutes = ('0' + today.getMinutes()).slice(-2)
    const seconds = ('0' + today.getSeconds()).slice(-2)

    return hours + ':' + minutes + ':' + seconds
}

const greet = () => {

}

const register = async (client, message, trimmedContent) => {
    const targetServer = client.guilds.cache.get('809336749977239572')
    const senderID = message.channel.recipient.id

    trimmedContent = trimmedContent.split(" ")

    if (trimmedContent.length < 3) {
        message.author.send("The !register or !r command requires the following 4 parameters: Class, Lecturer's Assistant Code, and Student Name in that exact order.")
        return
    }

    const classCode = trimmedContent[0].toUpperCase()
    const assistantCode = trimmedContent[1].toUpperCase()
    const studentName = capitalize(trimmedContent.slice(2).join(" "))

    if (!Object.keys(classes).includes(classCode)) {
        message.author.send("The class code must be either **A** , **B** , or **C** .")
        return
    }

    if (!assistantCodes.includes(assistantCode)) {
        message.author.send("The assistant code must be either **EU** , **GSW** , **LY** , **DZ** , **MYM** , **NAD** , **PS** , **MAN** , **TAZ** , **ZB** .")
        return
    }

    if (hasNumber(studentName)) {
        message.author.send("Student name must not contain number of symbols.")
        return
    }

    const targetRole = targetServer.roles.cache.get(classes[classCode])

    const nickname = `${classCode} - ${assistantCode} - ${studentName}`

    let sender
    await targetServer.members.fetch(senderID).then(member => sender = member)
    sender.setNickname(nickname)

    sender.roles.cache.forEach(role => {
        if (role.id !== '809336749977239572') {
            sender.roles.remove(role).catch(console.error)
        }
    })
    
    sender.roles.add(targetRole).catch(console.error)
}

const sendAnswer = async (client, message, trimmedContent) => {
    const targetServer = client.guilds.cache.get('809336749977239572')
    const senderID = message.channel.recipient.id
    let senderNickname
    await targetServer.members.fetch(senderID).then(member => senderNickname = member.nickname)
    
    const targetChannel = client.channels.cache.get('811206212782653440')
    const answer = `${getTime()} - **${senderNickname}** : ${trimmedContent}`
    targetChannel.send(answer)
}

const sendQuestion = async (client, message, trimmedContent) => {
    const targetServer = client.guilds.cache.get('809336749977239572')
    const senderID = message.channel.recipient.id
    let senderNickname
    await targetServer.members.fetch(senderID).then(member => senderNickname = member.nickname)
    
    const targetChannel = client.channels.cache.get('811241341589389404')
    const question = `${trimmedContent}`
    targetChannel.send(question).then(question => {
        question.react("⬆")
    })
}

const clear = message => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.messages.fetch().then(results => {
            message.channel.bulkDelete(results)
        })
    }
}

exports.greet = greet
exports.register = register
exports.sendAnswer = sendAnswer
exports.sendQuestion = sendQuestion
exports.clear = clear