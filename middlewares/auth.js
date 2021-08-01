const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const MESSAGE_401 = 'Необходима авторизация!';

// const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(MESSAGE_401);
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError(MESSAGE_401);
  }

  req.user = payload;

  next();
};
