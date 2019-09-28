const { Router } = require('express');
const multer = require('multer');

const multerConfig = require('../config/multer');
const UserController = require('../app/users/UserController');
const SessionController = require('../app/sessions/SessionController');
const AvatarController = require('../app/avatars/AvatarController');
const InviteController = require('../app/invites/InviteController');

const authMiddleware = require('../middlewares/middleware');
const socketMiddleware = require('../middlewares/sockets');

const routes = Router();
const upload = multer(multerConfig);

routes.post('/registration', UserController.store);
routes.post('/login', SessionController.store);

routes.use(authMiddleware);
routes.use(socketMiddleware);

routes.get('/users', UserController.profile);
routes.put('/users', UserController.update);
routes.put('/users/avatar', upload.single('avatar'), AvatarController.store);
routes.post('/invites', InviteController.store);

function teste(data) {
  console.log(data);
}
module.exports = teste;
module.exports = routes;
