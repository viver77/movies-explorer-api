const movie = require('../models/movie');

const MESSAGE_400 = 'Переданы некорректные данные';
const MESSAGE_404 = 'Запрашиваемый фильм не найден';
const MESSAGE_403 = 'Нельзя удалять чужие фильмы';

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  movie.find({})
    .then((card) => res.status(200).send(
      { card },
    ))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { _id } = req.user;
  movie.create({ ...req.body, owner: _id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(MESSAGE_400));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  movie.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE_404);
      } else if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(MESSAGE_403);
      } else {
        movie.findByIdAndRemove(req.params.id)
          .then((deletedCard) => {
            res.send({ data: deletedCard });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(MESSAGE_400));
      } else {
        next(err);
      }
    });
};
