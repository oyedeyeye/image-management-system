const express = require('express')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const db = require('../services/dbConnect');
const uploadImage = require('./controllers/uploadImage')
const persistImage = require('./controllers/persistImage');
const deleteImage = require('./controllers/deleteImage');
const updateImage = require('./controllers/updateImage');
const retrieveImage = require('./controllers/retrieveImage');

const router = express.Router();


// Cloudinary Config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
console.log(cloudinary.config().cloud_name);

/** Image Management System Home API  ============================================= */
router.get('/', (request, response, next) => {
  response.json({
    message: `Hey! Your are connected to Image Management Repository`,
  });
  next();
});


/** Upload API  ============================================= */
router.post('/upload-image', async (request, response) => await uploadImage(request, response));


/** Upload and Persist Image API  ============================================= */
router.post('/persist-image', async (request, response) => await persistImage(request, response));


/** Retrieve an Image API ============================================= */
router.get('/retrieve-image/:cloudinary_id', async (request, response) => await retrieveImage(request, response));


/** Delete an Image API  ============================================= */
router.delete('/delete-image/:cloudinary_id', async (request, response) => await deleteImage(request, response));


/** Update Image API  ============================================= */
router.put('/update-image/:cloudinary_id', async (request, response) => await updateImage(request, response));


module.exports = router;
