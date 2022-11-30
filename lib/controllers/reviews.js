const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeDelete = require('../middleware/authorize-delete');
const { Review } = require('../models/Review');

module.exports = Router()
  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const review = await Review.getById(req.params.id);
      if (!review) next();
      res.json(review);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', [authenticate, authorizeDelete], async (req, res, next) => {
    try {
      await Review.delete(req.params.id);
      res.status(204);
      res.send();
    } catch (e) {
      next(e);
    }
  });
