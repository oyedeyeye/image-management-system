require('dotenv').config();
const db = require('../../../services/dbConnect');
const cloudinary = require('cloudinary').v2;


// Cloudinary Config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const retrieveImage = async (request, response) => {
  const { cloudinary_id } = request.params;

  // Query the database
  db.pool.connect((err, client) => {
    const idQuery = "SELECT * FROM images_tabl WHERE cloudinary_id = $1";
    const value = [cloudinary_id];
  });

  client
    .query(idQuery, value)
    .then((result) => {
      response.status(200).send({
        message: 'success',
        data: {
          id: result.rows[0].cloudinary_id,
          title: result.rows[0].title,
          url: result.rows[0].image_url,
        },
      });
    })
    .catch((error) => {
      response.status(401).send({
      status: 'failure',
      data: {
        message: 'Could not retrieve record!',
        error,
      },
    });
  });
};


module.exports = retrieveImage;
