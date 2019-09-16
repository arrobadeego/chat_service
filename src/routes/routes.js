const { Router } = require('express');
const multer = require('multer');

const uploadConfig = require('../config/upload');
const UserController = require('../app/users/UserController');
const ContactController = require('../app/contacts/ContactController');
const InviteController = require('../app/invites/InviteController');
const SessionController = require('../app/sessions/SessionController');
const AvatarController = require('../app/avatars/AvatarController');

const authMiddleware = require('../routes/middleware');

const routes = Router();
const upload = multer(uploadConfig);

routes.post('/registration', UserController.store);
routes.post('/login', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.put('/users/avatar', upload.single('avatar'), AvatarController.store);
routes.get('/users', UserController.profile);
routes.get('/contacts', ContactController.list);
routes.post('/sent', InviteController.store);
routes.post('/sent/request', InviteController.friendRequest);

module.exports = routes;
