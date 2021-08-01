require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const {
  celebrate, Joi, errors,
} = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const movieRouter = require('./routes/movie');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');

const MESSAGE_404 = 'Запрашиваемый ресурс не найден';

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());

// # проверяет переданные в теле почту и пароль
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  }),
}), login);

// # создаёт пользователя с переданными в теле
// # email, password и name
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().trim().min(2).max(30),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  }),
}), createUser);

// авторизация
app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', movieRouter);

app.use('/', () => {
  throw new NotFoundError(MESSAGE_404);
});

app.use(errorLogger); // подключаем логгер ошибок

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode)
    .send({ // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
