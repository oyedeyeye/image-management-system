require('dotenv').config();
const db = require('../../../services/dbConnect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (request, response) => {
  // Create user logic starts here
  if (!request.body) {
    response.status(404).send({
      message: 'Please fill the registration form'
    });
  }

  try {
    // Get the user input
    const { first_name, last_name, email, password, role } = request.body;

    // validate user input
    if (!(first_name && last_name && email && password && role)) {
      response.status(400).send({
        message: 'All input is required!'
      });
    }
    // Check if user already exists
    // Validate user exist in the database
    // const oldUser = 
    db.pool.connect((err, client) => {
      // Query
      const oldUserQuery = "SELECT * FROM users WHERE email = $1";
      const value = [email.toLowerCase()];
    
      // Execute
      client
      .query(oldUserQuery, value)
      .then((oldUser) => {
        if (oldUser.rows[0]) {
          response.status(409).send({
          message: 'User Already Exist. Please Login'
          });
        }        
      });
    });
    // Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create User in our database
    db.pool.connect((err, client) => {
      // Query
      const newUserQuery = `INSERT INTO users (first_name,
        last_name,
        email,
        password,
        role)
      VALUES($1,$2,$3,$4,$5) RETURNING *`;
      const value = [first_name, last_name, email.toLowerCase(), encryptedPassword, role];
    

      // Execute
      client
        .query(newUserQuery, value)
        .then((result) => {
          console.log(result.rows[0]);
          const user = result.rows[0];
          // create signed JWT Token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            { expiresIn: '8h' }
          );
          // save user token
          user.token = token;

          // return new user 
          return response.status(201).json(user);
          // response.status(201).send({
          //   status: 'success',
          //   data: {
          //     message: 'User Account Created Successfuly!'
          //   },
          // });
        })
        .catch((err) => {
          console.log(err);
        });
      });
  } catch (error) {
    console.error(error);
  }
};

module.exports = createUser;
