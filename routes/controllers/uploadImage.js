const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary Config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const uploadImage = async (request, response) => {
  // upload user supplied image to cloudinary
  const data = {
    image: request.body.image,
  };

  cloudinary.uploader
    .upload(data.image, {
      resource_type: 'image',
    })
    .then(result => {
      response.status(200).send({
        message: 'Image Successfully Uploaded!',
        result,
      });
    })
    .catch(error => {
      response.status(500).send({
        message: 'failed',
        error,
      });
    });
}


module.exports = uploadImage;
