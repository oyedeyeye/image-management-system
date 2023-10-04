require('dotenv').config();
const db = require('../../../services/dbConnect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userLogin = async (request, response) => {
// login logic starts here
  try {
    // Get user input
    const { email, password } = request.body;

    // validate user input
    if (!(email && password)) {
      response.status(400).send({
        message: 'Email or Password Incorrect!'
      });
    }

    // validate if the user exists
    db.pool.connect((err, client) => {
      // Query
      const userQuery = "SELECT * FROM users WHERE email = $1";
      const value = [email.toLowerCase()];
    
      // Execute
      client
      .query(userQuery, value)
      .then((result) => {
        const user = result.rows[0];
        const comparePassword = bcrypt.compare(password, user.password);
        if ( user && comparePassword ) {
          // create jwt token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: '8h'
            }
          );

          // save the token
          user.token = token;

          // return user data with token
          response.status(200).json(user);
        } else {
          response.status(400).send({
            message: 'Invalid Credentials'
          });
        }
      });
    });
    
  } catch (error) {
    console.log(error);
  }

// login logic ends here 
};

module.exports = userLogin;
