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
			name: 'coinflip',
			aliases: ['flip'],
			group: 'bruh',
			memberName: 'coinflip',
			description: 'Flips a coin. Feeling lucky?',
      throttling: {
    		usages: 1,
    		duration: 15,
    	},
      args: [
        {
    			key: 'choice',
    			prompt: 'heads or tails?',
    			type: 'string',
          oneOf: ['heads', 'tails'],
    		},
    		{
    			key: 'wager',
    			prompt: 'How many coins you are willing to wager (must be <= current balance)',
    			type: 'integer'
    		}
  	],
		});
	}



  run(message,{ choice,wager }) {
    let id = message.author.id;
    let tag = message.author.tag;
    pool.query('SELECT * FROM users WHERE user_id = $1',[id], (error, results) => {
      if (error) {
        throw error
      }

      //new user
      if(results.rows.length == 0)
      {
        return message.reply(`You don't have any coin to wager yet!`);
      }
      //existing user
      else
      {
        let coin = results.rows[0].coin;
        if(wager > coin)
        {
          return message.reply(`You don't have enough coin to wager that!`)
        }
        else
        {
          let flip = (Math.random() >= 0.5) ? 'heads':'tails';
          if(choice === flip)
          {
            pool.query('UPDATE users SET coin=coin+$1, tag=$2 WHERE user_id = $3',[wager,tag,id], (error, results) => {
              if (error) {
                throw error
              }
            });
            return message.reply(`The flip was ${flip}! You gained ${wager} coins.`);
          }
          else
          {
            pool.query('UPDATE users SET coin=coin-$1, tag=$2 WHERE user_id = $3',[wager,tag,id], (error, results) => {
              if (error) {
                throw error
              }
            });
            return message.reply(`The flip was ${flip}. You lost ${wager} coins.`);
          }
        }
      }
    });

	}

};
