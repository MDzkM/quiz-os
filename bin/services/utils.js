const { NODE_ENV } = process.env.NODE_ENV === 'production' ? process.env : require('../../config.json')

const classes = {
    A: '811530070090317834',
    B: '811533539957932064',
    C: '811533545859973142',
}
const assistantCodes = {
    EU: '812208846046756874',
    FA: '812208851403014164',
    GSW: '812208856868454420',
    LY: '812208861405904926',
    DZ: '812208865344749578',
    MYM: '812208870331252757',
    NAD: '812208875494703104',
    PS: '812208878803484674',
    MAN: '812208882776408084',
    TAZ: '812208886324396032',
    ZB: '812209048778178578'
}

const capitalize = input => input.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))

const hasNumber = input => /\d/.test(input)

const getTime = () => {
    const today = new Date()
    
    const hours = NODE_ENV === 'production' ? (today.getHours() + 7) % 24 : today.getHours()
    const minutes = ('0' + today.getMinutes()).slice(-2)
    const seconds = ('0' + today.getSeconds()).slice(-2)

    return hours + ':' + minutes + ':' + seconds
}

const addReactions = (message, reactions) => {
    if (reactions.length === 0) { return }
    message.react(reactions[0])
    reactions.shift()
    if (reactions.length > 0) {
        setTimeout(() => addReactions(message, reactions), 750)
    }
}

const sendDefaultMessage = async (client, channelID, text, reactions=[]) => {
    const channel = await client.channels.fetch(channelID)

    channel.messages.fetch().then(messages => {
        if (messages.size === 0) {
            channel.send(text).then(message => addReactions(message, reactions))
        } else {
            for (const message of messages) {
                message[1].edit(text)
                addReactions(message[1], reactions)
            }
        }
    })
}

const register = async (client, message, trimmedContent) => {
    const targetServer = client.guilds.cache.get('809336749977239572')
    const senderID = message.channel.recipient.id

    trimmedContent = trimmedContent.split(" ")

    if (trimmedContent.length < 3) {
        message.author.send("The !register or !r command requires the following 4 parameters: Class, Lecturer's Assistant Code, and Student Name in that exact order.")
        return
    }

    const githubUsername = trimmedContent[0]
    const studentEmail = trimmedContent[1]
    const classCode = trimmedContent[2].toUpperCase()
    const studentID = trimmedContent[3]
    const assistantCode = trimmedContent[4].toUpperCase()
    const studentName = capitalize(trimmedContent.slice(5).join(" "))

    if (!Object.keys(classes).includes(classCode)) {
        message.author.send("The class code must be either **A** , **B** , or **C** .")
        return
    }

    if (!Object.keys(assistantCodes).includes(assistantCode)) {
        message.author.send("The assistant code must be either **EU** , **GSW** , **LY** , **DZ** , **MYM** , **NAD** , **PS** , **MAN** , **TAZ** , **ZB** .")
        return
    }

    if (hasNumber(studentName)) {
        message.author.send("Student name must not contain number of symbols.")
        return
    }

    const nickname = `${classCode} - ${assistantCode} - ${studentName}`

    let sender
    await targetServer.members.fetch(senderID).then(member => sender = member)
    sender.setNickname(nickname)

    sender.roles.cache.forEach(role => {
        if (role.id !== '809336749977239572') {
            sender.roles.remove(role).catch(console.error)
        }
    })
    
    let targetRole = targetServer.roles.cache.get(classes[classCode])
    sender.roles.add(targetRole).catch(console.error)
    
    targetRole = targetServer.roles.cache.get(assistantCodes[assistantCode])
    sender.roles.add(targetRole).catch(console.error)
    
    targetRole = targetServer.roles.cache.get('811580431261499422')
    sender.roles.add(targetRole).catch(console.error)
    
    const registerLog = `${githubUsername};${studentEmail};${classCode};${studentID};${studentName}`
    const targetChannel = client.channels.cache.get('812315943006240818')
    targetChannel.send(registerLog)
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

exports.sendDefaultMessage = sendDefaultMessage
exports.register = register
exports.sendAnswer = sendAnswer
exports.sendQuestion = sendQuestion
exports.clear = clear