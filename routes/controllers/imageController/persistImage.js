require('dotenv').config();
const db = require('../../../services/dbConnect');
const cloudinary = require('cloudinary').v2;


// Cloudinary Config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const persistImage = async (request, response) => {
  // upload image from a user ==========================
  const { user_id } = request.body;
  const data = {
    title: request.body.title,
    image: request.body.image,
  };
  console.log(user_id);

  // cloudinary api
  cloudinary.uploader
    .upload(data.image, {
      resource_type: 'image',
    })
    .then((image) => {
      console.log(JSON.stringify(image));
      db.pool.connect((err, client) => {
        // run a postgres query if upload to cloudinary is successful
        const insertQuery = `INSERT INTO images_tabl (title, cloudinary_id, image_url, creator)
              VALUES($1,$2,$3,$4) RETURNING *`;
        const values = [data.title, image.public_id, image.secure_url, user_id];

        // executing the query
        client.query(insertQuery, values)
          .then((result) => {
            result = result.rows[0];

            // on successful response
            response.status(201).send({
              status: 'success',
              data: {
                message: 'Image Uploaded Successfully',
                title: result.title,
                cloudinary_id: result.cloudinary_id,
                image_url: result.image_url,
                // creator: result.creator,
              },
            });
          }).catch((e) => {
            response.status(500).send({
              message: 'failure',
              e,
            });
          });
      })
    }).catch((error) => {
      response.status(500).send({
        message: 'failure',
        error,
      });
    });
};


module.exports = persistImage;
