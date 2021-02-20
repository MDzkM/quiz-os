module.exports = (client) => {
    client.on('guildMemberAdd', member => {
        const message = '👋 Hello! I am **Helper OS**, the official guide for **Operating Systems 211** server.\n\nBefore you can participate on any activities, we need to make sure you are registered on this class. I will guide you through the steps and provide necessary information after you are signed up.\n\nTo begin, please send one the following commands on this direct message:```!register GITHUB_ACCOUNT EMAIL CLASS STUDENT_ID ASSISTANT_CODE FULL_NAME```or```!r GITHUB_ACCOUNT EMAIL CLASS STUDENT_ID ASSISTANT_CODE FULL_NAME```\nOnce registered, you will be assigned a nickname and role automatically on the **Operating Systems 211** server.'
        member.send(message)
    })
}