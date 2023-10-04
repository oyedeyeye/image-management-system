const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (request, response, next) => {
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

  } catch (error) {
    return response.status(401).send({
      message: 'Invalid Token. Please login before you proceed with this action'
    });
  }
  return next();
};

module.exports = verifyToken;
