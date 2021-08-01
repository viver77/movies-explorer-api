const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

const urlValidation = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

router.get('/', getMovies);

router.post('/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().trim().required(),
      director: Joi.string().trim().required(),
      duration: Joi.number().required(),
      year: Joi.string().trim().required(),
      description: Joi.string().trim().required(),
      image: Joi.string().trim().required().custom(urlValidation),
      trailer: Joi.string().trim().required().custom(urlValidation),
      nameRU: Joi.string().trim().required(),
      nameEN: Joi.string().trim().required(),
      thumbnail: Joi.string().trim().required().custom(urlValidation),
      movieId: Joi.number().required(),
    }),
  }), createMovie);

router.delete('/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }), deleteMovie);

module.exports = router;
