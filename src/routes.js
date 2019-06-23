const express = require('express');
const UserController = require('./users/UserController');
const ContactController = require('./contacts/ContactController');

const routes = new express.Router();

routes.post('/login', UserController.authenticate);
routes.post('/registration', UserController.store);
routes.get('/contacts', ContactController.list);

module.exports = routes;
