const jwt = require('jsonwebtoken');
require('dotenv').config()

const config = process.env;

const authorization = (request, response, next) => {
  // Get token from request
  const token = request.body.token || request.query.token || request.headers['x-access-token'];

  // Validate the token

  if (!token) {
    return response.status(400).send({
      message: 'Authentication failed! Please login'
    });
  }

    // decoding the token
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    request.user = decoded;
    return next();
  } catch (error) {
    return response.status(401).send({
      message: 'Invalid Token. Please login before you proceed with this action'
    });
  }
};

module.exports = authorization;
