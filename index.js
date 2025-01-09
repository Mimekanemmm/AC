const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Keep bot alive with web server
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});
app.listen(port, () => console.log(`Server running on port ${port}`));

// Bot setup
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'Oops! Something went wrong!',
            ephemeral: true
        });
    }
});

client.once('ready', () => {
    console.log('Bot is ready! 🚀');
});

client.login(process.env.TOKEN);
