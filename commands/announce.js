const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the announcement to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the announcement')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The announcement message')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message');

        await channel.send({
            embeds: [{
                title: title,
                description: message,
                color: 0x0099ff,
                timestamp: new Date(),
                footer: {
                    text: `Announced by ${interaction.user.tag}`
                }
            }]
        });

        await interaction.reply({
            content: `Announcement sent to ${channel}!`,
            ephemeral: true
        });
    },
};
