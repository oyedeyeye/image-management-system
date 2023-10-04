require('dotenv').config();
const db = require('../../../services/dbConnect');
const cloudinary = require('cloudinary').v2;


// Cloudinary Config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const deleteImage = async (request, response) => {
  const { cloudinary_id } = request.params;

  // Execute delete operation from Cloudinary first
  cloudinary.uploader
  .destroy(cloudinary_id, {
    resource_type: 'image',
    invalidate: true,
  })

  // Then delete image record from postgres as well
  .then(() => {
    // response.status(200).send({
    //   message: 'success',
    //   result,
    // });

    db.pool.connect((err, client) => {
      // Query
      const deleteQuery = "DELETE FROM images_tabl WHERE cloudinary_id = $1";
      const value = [cloudinary_id];
    });

    // Execute
    client
    .query(deleteQuery, value)
    .then((result) => {
      response.status(200).send({
        message: 'Image Deleted Successfully!',
        result,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: 'Image Could not be Deleted!',
        error,
      });
    });
  })
  .catch((err) => {
    response.status(500).send({
      message: 'failure',
      err,
    });
  });
};


module.exports = deleteImage;
