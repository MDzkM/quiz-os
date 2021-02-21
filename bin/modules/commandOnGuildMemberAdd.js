module.exports = (client) => {
    client.on('guildMemberAdd', member => {
        const message = '👋 Hello! I am **Helper OS**, the official guide for **Operating Systems 211** server.\n\nBefore you can participate on any activities, we need to make sure you are registered on this class. I will guide you through the steps and provide necessary information after you are signed up.\n\nTo begin, please send one the following commands on this direct message: `!register GITHUB_USERNAME EMAIL CLASS STUDENT_ID STUDENT_NAME` or `!r GITHUB_USERNAME EMAIL CLASS STUDENT_ID STUDENT_NAME`\n\n**PLEASE USE SPACE ON YOUR FULL NAME AND USE THE NAME REGISTERED IN SIAK.** Example: `!r mdzkm mdzkm17@gmail.com A 1806141334 Muhammad Dzikra Muzaki`\n\nOnce registered, you will be assigned a nickname and role automatically on the **Operating Systems 211** server.'
        member.send(message)
    })
}