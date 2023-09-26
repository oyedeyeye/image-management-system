require('dotenv').config();
const db = require('../../services/dbConnect');
const cloudinary = require('cloudinary').v2;


// Cloudinary Config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const updateImage = async (request, response) => {
  // unique cloudinary_id
  const { cloudinary_id } = request.params;

  // Image information from user
  const data = {
    title: request.body.title,
    image: request.body.image,
  };

  // Execute delete operation from Cloudinary first
  cloudinary.uploader
  .destroy(cloudinary_id, {
    resource_type: 'image',
    invalidate: true,
  })

  // Upload the new image
  .then(() => {
    cloudinary.uploader
      .upload(data.image, {
        resource_type: 'image'
      })

      // Update the database as well
      .then((result) => {
        db.pool.connect((err, client) => {

          // postgreSQL Update Query
          const updateQuery = 
            "UPDATE images_tabl SET title = $1, cloudinary_id = $2, image_url = $3 WHERE cloudinary_id = $4";
          const value = [
            data.title,
            result.public_id,
            result.secure_url,
            cloudinary_id
          ];
        });

        // Execute
        client
        .query(updateQuery, value)
        .then(() => {

          // on success, send status message
          response.status(201).send({
            status: 'success',
            data: {
              message: "Image Updated Successfully!",
            }
          });
        })
        .catch((err) => {
          response.status(500).send({
            message: 'Update Failed',
            err,
          });
        });
      })
      .catch((e) => {
        response.status(500).send({
          message: 'failed',
          e,
        });
      });
  })
  .catch((error) => {
    response.status(500).send({
      message: 'failed',
      error,
    });
  });
};

module.exports = updateImage;
