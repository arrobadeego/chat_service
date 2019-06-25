const express = require('express');
const UserController = require('./users/UserController');
const ContactController = require('./contacts/ContactController');
const InviteController = require('./invites/InviteController');

const routes = new express.Router();

routes.post('/login', UserController.authenticate);
routes.post('/registration', UserController.store);
routes.get('/contacts', ContactController.list);
routes.post('/sent', InviteController.store);
routes.post('/sent/request', InviteController.friendRequest);

module.exports = routes;
