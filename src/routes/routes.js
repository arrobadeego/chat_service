const { Router } = require('express');
const multer = require('multer');

const multerConfig = require('../config/multer');
const UserController = require('../app/users/UserController');
const SessionController = require('../app/sessions/SessionController');
const AvatarController = require('../app/avatars/AvatarController');
const InviteController = require('../app/invites/InviteController');

const authMiddleware = require('../routes/middleware');

const routes = Router();
const upload = multer(multerConfig);

routes.post('/registration', UserController.store);
routes.post('/login', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.profile);
routes.put('/users', UserController.update);
routes.put('/users/avatar', upload.single('avatar'), AvatarController.store);
routes.post('/invites', InviteController.store);
// routes.get('/contacts', ContactController.list);
// routes.post('/sent', InviteController.store);
// routes.post('/sent/request', InviteController.friendRequest);

module.exports = routes;
