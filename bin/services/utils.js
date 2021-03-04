const { NODE_ENV } = process.env.NODE_ENV === 'production' ? process.env : require('../../config.json')
const { MessageEmbed } = require('discord.js')

const buyMeACoffeeEmbed = new MessageEmbed()
	.setTitle('Come Visit Us!')
	.setURL('https://www.buymeacoffee.com/mdzkm')
	.setDescription('If you like what you are seeing, please consider supporting us using the link above.\n\n_Click the title of this embedded message_')
	.setImage('https://cdn.buymeacoffee.com/buttons/v2/default-blue.png')

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

const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const isNum = input => /^\d+$/.test(input);

const capitalize = input => input.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))

const isValidName = input => /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(input)

const trimNickname = input => {
    if (input.length > 32) {
        input = input.split(" ").slice(0, -1).join(" ")
        return trimNickname(input)
    }
    return input
}

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

const register = (client, message, trimmedContent) => {
    const https = require('https');
    const targetServer = client.guilds.cache.get('809336749977239572')
    const senderID = message.channel.recipient.id

    trimmedContent = trimmedContent.split(" ")

    if (trimmedContent.length < 5) {
        message.author.send("The !register or !r command requires the following 4 parameters: Github Username, Email, Class, Student ID, and Student Name in that exact order.")
        return
    }

    const githubUsername = trimmedContent[0]
    const studentEmail = trimmedContent[1]
    const classCode = trimmedContent[2].toUpperCase()
    const studentID = trimmedContent[3]
    const studentName = capitalize(trimmedContent.slice(4).join(" "))

    https.get(`https://github.com/${githubUsername}/`, async (res) => {
        if (res.statusCode !== 200) {
            message.author.send("Github account not found. Please use a valid github username.")
            return
        }

        if (!validateEmail(studentEmail)) {
            message.author.send("Please use a valid email format.")
            return
        }
    
        if (!Object.keys(classes).includes(classCode)) {
            message.author.send("The class code must be either **A**, **B**, or **C**.")
            return
        }
    
        if (studentID.length !== 10) {
            message.author.send("Student ID is not valid. Length must be 10 digits.")
            return
        }
    
        if (!isNum(studentID)) {
            message.author.send("Student ID must not contain alphabet or symbols.")
            return
        }
    
        if (!isValidName(studentName)) {
            message.author.send("Student name must not contain number of symbols.")
            return
        }
    
        // let nickname = trimNickname(`${classCode} - ${studentName}`)
        let nickname = trimNickname(`${githubUsername} - ${studentName}`)
    
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
        
        targetRole = targetServer.roles.cache.get('811580431261499422')
        sender.roles.add(targetRole).catch(console.error)
        
        const registerLog = `${githubUsername};${studentEmail};${classCode};${studentID};${studentName}`
        const targetChannel = client.channels.cache.get('812315943006240818')
        targetChannel.send(registerLog)
        message.author.send("🎉 **Congratulations!** Now you can access new channels in the server. You can visit the **<#812346416935469066>** channel to see all of the general server rules or you can use the `!help` or `!h` command to learn about all the features I provide.\n\nFor more information about this server please visit this link http://bit.ly/os-discord-guide")
        message.author.send(buyMeACoffeeEmbed)
    })
}

const setAssistant =  async (client, message, trimmedContent) => {
    const targetServer = client.guilds.cache.get('809336749977239572')
    const senderID = message.channel.recipient.id

    const assistantCode = trimmedContent.toUpperCase()

    if (!Object.keys(assistantCodes).includes(assistantCode)) {
        message.author.send("The assistant code must be either **EU**, **FA**, **GSW**, **LY**, **DZ**, **MYM**, **NAD**, **PS**, **MAN**, **TAZ**, **ZB**.")
        return
    }

    let sender
    await targetServer.members.fetch(senderID).then(member => sender = member)
    const oldNickname = sender.nickname.toString()
    // let newNickname = trimNickname(oldNickname.slice(0, 1) + ` - ${assistantCode}` + oldNickname.slice(1))
    let newNickname = trimNickname(`${assistantCode} - ${oldNickname}`)

    sender.setNickname(newNickname)

    sender.roles.cache.forEach(role => {
        if (Object.values(assistantCodes).includes(role.id)) {
            sender.roles.remove(role).catch(console.error)
        }
    })
    
    targetRole = targetServer.roles.cache.get(assistantCodes[assistantCode])
    sender.roles.add(targetRole).catch(console.error)

    message.author.send(`You have been successfully assigned to the assistant **${assistantCode}**.`)
}

const sendAnswer = async (client, message, trimmedContent) => {
    const targetServer = client.guilds.cache.get('809336749977239572')
    const senderID = message.channel.recipient.id
    let senderNickname
    await targetServer.members.fetch(senderID).then(member => senderNickname = member.nickname)
    
    const targetChannel = client.channels.cache.get('811206212782653440')
    const answer = `${getTime()} **${senderNickname}** : ${trimmedContent}`
    targetChannel.send(answer, message.attachments.values().next().value)
    message.author.send("Your message was successfully sent. If you are sending characters like \* or \_ don't forget to escape it using the \\\\ character. For example: \\\\\* This is an escaped message \\\\\* (this message will not be converted into a bold text).")
}

const sendQuestion = async (client, message, trimmedContent) => {
    const targetChannel = client.channels.cache.get('811241341589389404')
    targetChannel.send(trimmedContent, message.attachments.values().next().value).then(question => {
        question.react("⬆")
    })
    message.author.send("Your question has been posted. Remember to check the **<#811241341589389404>** channel for existing questions. If your question has been asked before, upvote it instead of flooding the channel with duplicate questions.")
}

const sendSuggestion = async (client, message, trimmedContent) => {
    const targetChannel = client.channels.cache.get('816896630850584586')
    targetChannel.send(trimmedContent, message.attachments.values().next().value).then(question => {
        question.react("⬆")
    })
    message.author.send("Your question has been posted. Remember to check the **<#811241341589389404>** channel for existing questions. If your question has been asked before, upvote it instead of flooding the channel with duplicate questions.")
}

const sendPost = async (client, message, trimmedContent) => {
    if (message.member.roles.cache.some(role => role.id === '809337386185523230') || message.member.roles.cache.some(role => role.id === '809337568687554571')) {
        const targetChannel = client.channels.cache.get('811241716757299210')
        targetChannel.send(trimmedContent, message.attachments.values().next().value)
        message.channel.send("Your message was successfully sent. If you are sending characters like \* or \_ don't forget to escape it using the \\\\ character. For example: \\\\\* This is an escaped message \\\\\* (this message will not be converted into a bold text).")
    }
}

const sendHelp = message => {
    message.author.send("💻 **List of Commands** 💻\n\n**1.** The **Help** Command\n\n`!help` or `!h`\n\nThis command shows this List of Commands.\n\n**2.** The **Register** Command\n\n`!register GITHUB_USERNAME EMAIL CLASS STUDENT_ID STUDENT_NAME` or `!r GITHUB_USERNAME EMAIL CLASS STUDENT_ID STUDENT_NAME`\n\nThis command is used to register your Discord Account to the OS Discord Server and will automatically change your server nickname and assign roles.\n\n**Usage:** `!r aceyoga yoga@test.com X 1806123456 Yoga Mahendra`\n\n**3.** The **Set Assistant** Command\n\n`!set-assistant ASSISTANT_CODE` or `!sa ASSISTANT_CODE`\n\nThis command is used to assign yourself to the corresponding Lecturer's Assistant. This will also automatically grant you access to assistant specific channels.\n\n**Usage:** `!sa MYM`\n\n**4.** The **Answer** Command\n\n`!answer SENTENCE` or `!a SENTENCE`\n\nThis command records your answer to the system. Used in Live Quiz, and other events. If you are sending characters like \* or \_ don't forget to escape it using the \\\\ character. For example: \\\\\* This is an escaped message \\\\\* (this message will not be converted into a bold text). You can also send up to **1** image/file in the form of attachment to the command. To attach an image/file you can write the command and before sending it, use the **+** icon on the left of the message box to attach an image/file. Or you can select the attachment first and write the command in the 'Add a comment' box.\n\n**Usage:** `!a This is an answer.`\n\n**5.** The **Question** Command\n\n`!question SENTENCE` or `!q SENTENCE`\n\nThis command will post your question anonymously to faq-poll channel. Before you ask a question, please visit the **<#811241341589389404>** channel and make sure your question hasn't been asked previously. If the same question already exists please upvote that question instead of flooding the channel with duplicate questions. If you are sending characters like \* or \_ don't forget to escape it using the \\\\ character. For example: \\\\\* This is an escaped message \\\\\* (this message will not be converted into a bold text). You can also send up to **1** image/file in the form of attachment to the command. To attach an image/file you can write the command and before sending it, use the **+** icon on the left of the message box to attach an image/file. Or you can select the attachment first and write the command in the 'Add a comment' box.\n\n**Usage:** `!q How to use Bash?`\n\n**6.** The **Suggest** Command\n\n`!suggest SENTENCE` or `!s SENTENCE`\n\nThis command will send your suggestion anonymously to the suggestions channel. If you are sending characters like \* or \_ don't forget to escape it using the \\\\ character. For example: \\\\\* This is an escaped message \\\\\* (this message will not be converted into a bold text). You can also send up to **1** image/file in the form of attachment to the command. To attach an image/file you can write the command and before sending it, use the **+** icon on the left of the message box to attach an image/file. Or you can select the attachment first and write the command in the 'Add a comment' box.\n\n**Usage:** `!s Make learning more interactive`\n\nFor more information about this server please visit this link http://bit.ly/os-discord-guide")
    message.author.send(buyMeACoffeeEmbed)
}

const clear = message => {
    if (message.member.roles.cache.some(role => role.id === '809337386185523230') || message.member.roles.cache.some(role => role.id === '809337568687554571')) {
        message.channel.messages.fetch().then(results => {
            message.channel.bulkDelete(results)
        })
    }
}

exports.sendDefaultMessage = sendDefaultMessage
exports.register = register
exports.setAssistant = setAssistant
exports.sendAnswer = sendAnswer
exports.sendQuestion = sendQuestion
exports.sendSuggestion = sendSuggestion
exports.sendPost = sendPost
exports.sendHelp = sendHelp
exports.clear = clear