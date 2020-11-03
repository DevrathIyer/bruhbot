require('dotenv').config();


const OWNER = process.env.owner;
const INVITE = process.env.invite;
const TOKEN = process.env.TOKEN;
const DATABASE_URL = process.env.DATABASE_URL;

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
	commandPrefix: '~',
	owner: OWNER,
	invite: INVITE,
  disableEveryone: true,
  unknownCommandResponse: false
});


client.registry
	.registerDefaultTypes()
	.registerGroups([
		['bruh', 'Bruh Commands'],
		['smh', 'smh Commands'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with Commando');
});

client.on('error', console.error);

client.login(TOKEN);
