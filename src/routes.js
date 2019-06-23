const express = require('express');
const UserController = require('./users/UserController');

const routes = new express.Router();

routes.post('/login', UserController.authenticate);
routes.post('/registration', UserController.store);

module.exports = routes;
