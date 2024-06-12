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
	user: process.env.SUPABASE_USERNAME,
	password: process.env.SUPABASE_PASS,
	host: process.env.SUPABASE_HOST,
	port: process.env.SUPABASE_PORT,
	database: process.env.SUPABASE_DATABASE,
})
 
client.connect();

// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
// });
 
// await client.end()

module.exports = client