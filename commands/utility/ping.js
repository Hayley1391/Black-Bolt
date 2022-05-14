module.exports = {
    commands: ['ping'],
    expectedArgs: '<num1> <num2>',
    callback: (message, args, Discord, client) => {
        if(message.guild === null) {
            return
        }
        const user = message.member.user
        const embedForPing = new Discord.MessageEmbed()
            .setAuthor(`API Latency (ping)`, user.displayAvatarURL({ format: 'jpg', dynamic: true }))
            .setDescription(`API Latency is ${Math.round(client.ws.ping)}ms`)
            .setColor("#0a0a0a")
        message.channel.send(embedForPing)
    }
} 
