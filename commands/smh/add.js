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
			name: 'smh-add',
			aliases: ['smh-insert'],
			group: 'smh',
			memberName: 'add',
			description: 'Adds word to smh list',
      args: [
        {
    			key: 'word',
    			prompt: 'word to add',
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
        pool.query('INSERT INTO smh (letter,word) VALUES ($1,$2)',[word[0],word], (error, results) => {
          if (error) {
            throw error
          }
        });
        return message.say(`Added word ${word}!`);
      }
      //existing user
      else
      {
        return message.say(`Word ${word} already exists.`);
      }
    });

	}

};
