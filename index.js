const Discord = require('discord.js')
const client = new Discord.Client()

const { DISCORD_TOKEN } = process.env.NODE_ENV === 'production' ? process.env : require('./config.json')
const command = require('./command')

client.on('ready', () => {
    console.log('The client is ready!')

    command(client, 'ping', message => {
        message.channel.send('Pong!')
    })
})

client.login(DISCORD_TOKEN)