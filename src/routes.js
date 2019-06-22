const express = require('express');
const UserController = require('./users/UserController');

const routes = new express.Router();

routes.post('/users', UserController.store);

module.exports = routes;
