class Review {
  id;
  user_id;
  restaurant_id;
  stars;
  detail;

  constructor({ id, user_id, stars, detail }) {
    this.id = id;
    this.userId = user_id;
    this.stars = stars;
    this.detail = detail;
  }
}

module.exports = { Review };
