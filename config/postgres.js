const postgres = require('postgres');
const dotenv = require('dotenv');
dotenv.config();
//const sql = postgres({ /* options */ }) // will use psql environment variables
const sql = postgres('postgres://', {
    host                 : 'aws-0-eu-central-1.pooler.supabase.com',            // Postgres ip address[s] or domain name[s]
    port                 : 6543,          // Postgres server port[s]
    database             : 'postgres',            // Name of database to connect to
    username             : 'postgres.ykgmummfdcauqvwkjghc',            // Username of database user
    password             : process.env.SUPABASE_PASS,            // Password of database user
  })

module.exports = sql