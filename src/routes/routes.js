const { Router } = require('express');
const multer = require('multer');

const uploadConfig = require('../config/upload');
const UserController = require('../app/users/UserController');
const ContactController = require('../app/contacts/ContactController');
const InviteController = require('../app/invites/InviteController');

const routes = Router();
const upload = multer(uploadConfig);

routes.post('/login', UserController.authenticate);
routes.get('/profile', UserController.profile);
routes.post('/registration', upload.single('photo'), UserController.store);
routes.get('/contacts', ContactController.list);
routes.post('/sent', InviteController.store);
routes.post('/sent/request', InviteController.friendRequest);

module.exports = routes;
