const movie = require('../models/movie');

const MESSAGE_400 = 'Переданы некорректные данные';
const MESSAGE_404 = 'Запрашиваемый фильм не найден';
const MESSAGE_403 = 'Нельзя удалять чужие фильмы';

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  movie.find({})
    .then((movies) => res.status(200).send(
      movies,
    ))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { _id } = req.user;
  movie.create({ ...req.body, owner: _id })
    .then((mov) => {
      res.send(mov);
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
    .then((mov) => {
      if (!mov) {
        throw new NotFoundError(MESSAGE_404);
      } else if (mov.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(MESSAGE_403);
      } else {
        movie.findByIdAndRemove(req.params.id)
          .then((deletedMovie) => {
            res.send(deletedMovie);
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
