const { Command } = require('discord.js-commando');
require('dotenv').config();
const Keyv = require('keyv');
const DATABASE_URL = process.env.DATABASE_URL;

const keyv = new Keyv(DATABASE_URL,{ namespace: 'bruhs'});

async function asyncCall(message) {
  let bruhs = await keyv.get(message.author.tag);
  console.log(bruhs);
  if(!bruhs)
  {
    bruhs = 0;
  }
  bruhs++;

  keyv.set(message.author.tag,bruhs);
}

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bruh',
			aliases: ['bruh-moment'],
			group: 'bruh',
			memberName: 'bruh',
			description: 'Adds to bruh count',
      throttling: {
    		usages: 1,
    		duration: 60,
    	},
		});
	}



  run(message) {
    asyncCall(message);

		return message.say(`bruh`);
	}


};
