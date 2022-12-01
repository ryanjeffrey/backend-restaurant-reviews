const { Review } = require('../models/Review');

module.exports = async (req, res, next) => {
  const review = await Review.getById(req.params.id);
  try {
    if (review && (req.user.email === 'admin' || req.user.id !== review.userId))
      throw new Error('You do not have access to view this page');
    next();
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
