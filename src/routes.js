const express = require('express');
const UserController = require('./users/UserController');
const ContactController = require('./contacts/ContactController');
const InviteController = require('./invites/InviteController');

const routes = new express.Router();

routes.post('/login', UserController.authenticate);
routes.post('/registration', UserController.store);
routes.get('/contacts', ContactController.list);
// routes.get('/sent', SentController.list);
routes.post('/sent', InviteController.store);

module.exports = routes;
