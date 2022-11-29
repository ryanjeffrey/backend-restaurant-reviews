const pool = require('../utils/pool');

class Review {
  id;
  user_id;
  restaurant_id;
  stars;
  detail;

  constructor({ id, user_id, restaurant_id, stars, detail }) {
    this.id = id;
    this.userId = user_id;
    this.restaurantId = restaurant_id;
    this.stars = stars;
    this.detail = detail;
  }

  static async insert({ restaurantId, userId, stars, detail }) {
    const { rows } = await pool.query(
      'INSERT INTO reviews (restaurant_id, user_id, stars, detail) VALUES ($1, $2, $3, $4) RETURNING *',
      [restaurantId, userId, stars, detail]
    );
    return new Review(rows[0]);
  }
}

module.exports = { Review };
