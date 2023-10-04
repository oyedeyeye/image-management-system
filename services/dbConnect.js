const Pool = require("pg").Pool;
require('dotenv').config();


/*
const connectDB = () => {
  try {
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 30000,
    });
// 
    pool.connect('success', () => console.log("Successfully connected to the Database"));

    const createTables = () => {
      const dbTables = `
      -- const usersTable
      CREATE TABLE IF NOT EXISTS
        users(
          user_id INT GENERATED ALWAYS AS IDENTITY,
          first_name VARCHAR(128) NOT NULL,
          last_name VARCHAR(128) NOT NULL,
          email VARCHAR(128) NOT NULL,
          password VARCHAR(128) NOT NULL,
          role VARCHAR(128) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          PRIMARY KEY(user_id)
        );
    
      -- const imageTable
      CREATE TABLE IF NOT EXISTS
        images_tabl(
          id INT GENERATED ALWAYS AS IDENTITY,
          title VARCHAR(128) NOT NULL,
          cloudinary_id VARCHAR(128) NOT NULL,
          image_url VARCHAR(128) NOT NULL,
          creator INT,
          created_at TIMESTAMP DEFAULT NOW(),
          PRIMARY KEY(id),
          CONSTRAINT fk_user
            FOREIGN KEY(creator)
              REFERENCES users(user_id)
              ON DELETE SET NULL
        )`;
    
      // connectDB. 
      pool
      .query(dbTables)
        .then((result) => {
          console.log(result);
          pool.end();
        })
        .catch((error) => {
          console.error(error);
          pool.end();
        });
    };

    return {
      createTables: createTables
    };
  } catch (error) {
    console.error(error);
  };
};
connectDB();

*/

/* Set the production variable. This will be called when deployed to a live host
const isProduction = process.env.NODE_ENV === 'production';

// configuration details
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// if the project has been deployed, connect with the host's DATABASE_URL
// else connect with the local DATABASE_URL
*/

const pool = new Pool({
  // connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  // ssl: isProduction,

  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
}); 

pool.on('connect', () => console.log("Successfully connected to the Database"));

const createTables = () => {
  const dbTables = `
  -- const usersTable
  CREATE TABLE IF NOT EXISTS
    users(
      user_id INT GENERATED ALWAYS AS IDENTITY,
      first_name VARCHAR(128) NOT NULL,
      last_name VARCHAR(128) NOT NULL,
      email VARCHAR(128) NOT NULL,
      password VARCHAR(128) NOT NULL,
      role VARCHAR(128) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY(user_id)
    );

  -- const imageTable
  CREATE TABLE IF NOT EXISTS
    images_tabl(
      id INT GENERATED ALWAYS AS IDENTITY,
      title VARCHAR(128) NOT NULL,
      cloudinary_id VARCHAR(128) NOT NULL,
      image_url VARCHAR(128) NOT NULL,
      creator INT,
      created_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY(id),
      CONSTRAINT fk_user
        FOREIGN KEY(creator)
          REFERENCES users(user_id)
          ON DELETE SET NULL
    )`;
// 
  //  connectDB. 
  pool
  .query(dbTables)
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
