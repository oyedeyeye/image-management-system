const express = require('express')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../services/dbConnect');
const uploadImage = require('./controllers/imageController/uploadImage')
const persistImage = require('./controllers/imageController/persistImage');
const deleteImage = require('./controllers/imageController/deleteImage');
const updateImage = require('./controllers/imageController/updateImage');
const retrieveImage = require('./controllers/imageController/retrieveImage');
const createUser = require('./controllers/userController/createUser');
const userLogin = require('./controllers/userController/login');
const auth = require('./../controllers/authController');

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


/** Create User API  ============================================= */
router.post('/create-user', async (request, response) => await createUser(request, response));


/** Login User API  ============================================= */
router.post('/login-user', async (request, response) => await userLogin(request, response));


/** Upload API  ============================================= */
router.post('/upload-image', auth, async (request, response) => await uploadImage(request, response));


/** Upload and Persist Image API  ============================================= */
router.post('/persist-image', auth, async (request, response) => await persistImage(request, response));


/** Retrieve an Image API ============================================= */
router.get('/retrieve-image/:cloudinary_id', auth, async (request, response) => await retrieveImage(request, response));


/** Delete an Image API  ============================================= */
router.delete('/delete-image/:cloudinary_id', auth, async (request, response) => await deleteImage(request, response));


/** Update Image API  ============================================= */
router.put('/update-image/:cloudinary_id', auth, async (request, response) => await updateImage(request, response));


module.exports = router;
