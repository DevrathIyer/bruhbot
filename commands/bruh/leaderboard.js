const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

const Pool = require('pg').Pool
const pool = new Pool({
  connectionString:DATABASE_URL
});

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leaderboard',
			aliases: ['top'],
			group: 'bruh',
			memberName: 'leaderboard',
			description: 'displays leaderboard',
      throttling: {
    		usages: 1,
    		duration: 30,
    	},
		});
	}



  run(message) {

    pool.query('SELECT * FROM users ORDER BY bruhs DESC', (error, results) => {
      if (error) {
        throw error
      }
      let tags = [];
      let bruhs = [];
      for(var row in results.rows.slice(0,10))
      {
        tags.push(results.rows[row].tag);
        bruhs.push(results.rows[row].bruhs);
      }

      const embed = new MessageEmbed()
      .setAuthor(`Leaderboard for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
      .setColor(0x51267)
      .addFields({ name: 'Top 10', value: tags, inline: true },
        { name: 'Bruhs', value: bruhs, inline: true });

      return message.channel.send(embed);
    });

	}

};
