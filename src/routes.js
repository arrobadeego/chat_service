const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const UserController = require('./users/UserController');
const ContactController = require('./contacts/ContactController');
const InviteController = require('./invites/InviteController');

const routes = new express.Router();
const upload = multer(uploadConfig);

routes.post('/login', UserController.authenticate);
routes.get('/profile', UserController.profile);
routes.post('/registration', upload.single('photo'), UserController.store);
routes.get('/contacts', ContactController.list);
routes.post('/sent', InviteController.store);
routes.post('/sent/request', InviteController.friendRequest);

module.exports = routes;
