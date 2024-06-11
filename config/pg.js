const { Pool, Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// const pool = new Pool({
// 	user: 'postgres.ykgmummfdcauqvwkjghc',
// 	password: process.env.SUPABASE_PASS,
// 	host: 'aws-0-eu-central-1.pooler.supabase.com',
// 	port: 6543,
// 	database: 'postgres',
// })
 
// console.log(await pool.query('SELECT NOW()'))
 
const client = new Client({
	user: 'postgres.ykgmummfdcauqvwkjghc',
	password: process.env.SUPABASE_PASS,
	host: 'aws-0-eu-central-1.pooler.supabase.com',
	port: 6543,
	database: 'postgres',
})
 
client.connect();

// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
// });
 
// await client.end()

module.exports = client