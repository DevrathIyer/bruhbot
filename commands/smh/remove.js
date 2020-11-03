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
			name: 'smh-remove',
			aliases: ['smh-delete'],
			group: 'smh',
			memberName: 'remove',
			description: 'Removes word from smh list',
      args: [
        {
    			key: 'word',
    			prompt: 'word to remove',
    			type: 'string',
          validate: word => {
            word = word.toLowerCase();
            if (word[0] === "s" || word[0] === "m" || word[0] === "h") return true;
            return "Word must start with 's', 'm', or 'h'!";
          }
    		},
  	],
		});
	}



  run(message, { word }) {
    word = word.toLowerCase();
    pool.query('SELECT * FROM smh WHERE word = $1 limit 1',[word], (error, results) => {
      if (error) {
        throw error
      }

      //new word
      if(results.rows.length == 0)
      {
        return message.say(`Word ${word} does not exist.`);
      }
      //existing word
      else
      {
        pool.query('DELETE FROM smh WHERE word = $1 ',[word], (error, results) => {
          if (error) {
            throw error
          }
        });
        return message.say(`Deleted word ${word}!`);
      }
    });

	}

};
