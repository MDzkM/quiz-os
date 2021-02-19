module.exports = (client) => {
    client.on('guildMemberAdd', member => {
        const message = '👋 Hello! I am **Helper OS**, the official guide for **Operating Systems 211** server.\n\nPlease register using the command ```!register GITHUB_ACCOUNT EMAIL CLASS STUDENT_ID ASSISTANT_CODE FULL_NAME``` or ```!r GITHUB_ACCOUNT EMAIL CLASS STUDENT_ID ASSISTANT_CODE FULL_NAME```'
        member.send(message)
    })
}