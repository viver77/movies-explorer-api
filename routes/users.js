const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMe,
  updateUsers,
} = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().trim().required().min(2)
        .max(30),
      email: Joi.string().trim().email().required(),
    }),
  }), updateUsers);

module.exports = router;
