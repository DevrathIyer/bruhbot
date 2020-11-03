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
			name: 'smh',
			aliases: [],
			group: 'smh',
			memberName: 'smh',
			description: 'Tells you what SMH stands for',
		});
	}



  run(message) {
    let s,m,h = "";
    pool.query("select * from smh where letter = 's' order by random() limit 1;", (error, results1) => {
      if (error) {
        throw error
      }
      s = results1.rows[0].word;
      pool.query("select * from smh where letter = 'm' order by random() limit 1;", (error, results2) => {
        if (error) {
          throw error
        }
        m = results2.rows[0].word;
        pool.query("select * from smh where letter = 'h' order by random() limit 1;", (error, results3) => {
          if (error) {
            throw error
          }
          h = results3.rows[0].word;
          return message.reply(`SMH stands for: ${s} ${m} ${h}!`);
        });
      });
    });


	}

};
