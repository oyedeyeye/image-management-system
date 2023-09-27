const Pool = require("pg").Pool;
require('dotenv').config();

// const connectDB = async () => {
//   try {
//     const pool = new Pool({
//       user: process.env.PGUSER,
//       host: process.env.PGHOST,
//       database: process.env.PGDATABASE,
//       password: process.env.PGPASSWORD,
//       port: process.env.PGPORT,
//       max: 10, // max number of clients in the pool
//       idleTimeoutMillis: 30000,
//     });

//     await pool.connect('success', () => console.log("Successfully connected to the Database"));

//   } catch (error) {
//     console.error(error);
//   }
// };

// connectDB();

// Set the production variable. This will be called when deployed to a live host
const isProduction = process.env.NODE_ENV === 'production';

// configuration details
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// if the project has been deployed, connect with the host's DATABASE_URL
// else connect with the local DATABASE_URL

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
  /*
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,*/
}); 

pool.on('connect', () => console.log("Successfully connected to the Database"));

const createTables = () => {
  const imageTable = `CREATE TABLE IF NOT EXISTS
    images_tabl(
      id SERIAL PRIMARY KEY,
      title VARCHAR(128) NOT NULL,
      cloudinary_id VARCHAR(128) NOT NULL,
      image_url VARCHAR(128) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`;

  /* connectDB. */
  pool
  .query(imageTable)
    .then((result) => {
      console.log(result);
      pool.end();
    })
    .catch((error) => {
      console.error(error);
      pool.end();
    });
};

// export the pool and createTables
module.exports = {
  createTables,
  pool,
};

require('make-runnable');
