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

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
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
