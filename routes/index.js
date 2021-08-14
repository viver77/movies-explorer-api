const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const movieRouter = require('./movies');
const userRouter = require('./users');

// # проверяет переданные в теле почту и пароль
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  }),
}), login);

// # создаёт пользователя с переданными в теле
// # email, password и name
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().trim().min(2).max(30),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  }),
}), createUser);

// авторизация
router.use(auth);

router.use('/movies', movieRouter);
router.use('/users', userRouter);

module.exports = router;
