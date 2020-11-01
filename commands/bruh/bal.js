const { Command } = require('discord.js-commando');
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

const Pool = require('pg').Pool
const pool = new Pool({
  connectionString:DATABASE_URL
});

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bal',
			aliases: ['count'],
			group: 'bruh',
			memberName: 'bal',
			description: 'Checks current coin balance and bruh count',
      throttling: {
    		usages: 1,
    		duration: 60,
    	},
		});
	}



  run(message) {
    let id = message.author.id;
    let tag = message.author.tag;
    pool.query('SELECT * FROM users WHERE user_id = $1',[id], (error, results) => {
      if (error) {
        throw error
      }

      //new user
      if(results.rows.length == 0)
      {
        pool.query('INSERT INTO users (user_id,bruhs,tag,coin) VALUES ($1,1,$2)',[id,tag], (error, results) => {
          if (error) {
            throw error
          }
        });
        return message.reply(`You have bruhed 1 time and have 0 coin`);
      }
      //existing user
      else
      {
        let user = results.rows[0];
        return message.reply(`You have bruhed ${user.bruhs} times and have ${user.coin} coin`);
      }
    });

	}

};
