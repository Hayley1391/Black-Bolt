const { prefix } = require('../config.json')
const Discord = require('discord.js')
const mongo = require('../mongo')

const validatePermissions = (permissions) => {
    const validPermissions = [
        'ADMINISTRATOR',
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS'
    ]

    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unkown permission node "${permission}`)
        }
    }
}

module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'You do not have the required permissions to execute this command',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback
    } = commandOptions

    //Ensure command is array

    if (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`${commands[0]}✅`)

    //Ensure perms is array and valid

    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions]
        }

        validatePermissions(permissions)
    }

    //listen for message

    client.on('message', message => {
        const { member, content, guild } = message
        for (const alias of commands) {
            if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {

                //ensure correct perms
                for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        message.reply(permissionError)
                    }
                }

                //ensure roles
                for (const requoedRole of requiredRoles) {
                    const role = guild.roles.chache.find(role =>
                        role.name === requoedRole)

                    if (!roles || member.roles.cache.has(role.id)) {
                        message.reply(`You must have the ${requoedRole} role to use this command`)
                    }
                }

                //create args

                const args = content.split(/[ ]+/)

                //remove the command first index
                args.shift()

                //ensure correct args
                if (args.length < minArgs || (
                    maxArgs !== null && args.length > maxArgs
                )) {
                    message.channel.send(`Incorrect sytax! Use \`\`${prefix}${alias} ${expectedArgs}\`\``)
                    return
                }

                //handle code
                callback(message, args, Discord, client, mongo, args.join(' '))

                return
            }
        }
    })
} 