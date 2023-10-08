require('dotenv').config();
const db = require('../../../services/dbConnect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkUser = require('../../../utils/checkUser');

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
    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create User in our database
    db.pool.connect((err, client) => {
      // Query
      const newUserQuery = `INSERT INTO users (first_name, last_name, email, password, role)
      VALUES($1,$2,$3,$4,$5) RETURNING *`;
      const value = [first_name, last_name, email.toLowerCase(), encryptedPassword, role];    

      // Execute
      client
        .query(newUserQuery, value)
        .then((result) => {
          // console.log(result.rows[0]);
          const user = result.rows[0];
          const userId = user.user_id;

          // create signed JWT Token
          const token = jwt.sign(
            { user_id: user._id, userId },
            process.env.TOKEN_KEY,
            { expiresIn: '8h' }
          );

          // save user token
          user.token = token;

          // return new user 
          return response.status(201).json(user);
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
