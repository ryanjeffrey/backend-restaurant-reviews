const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('Restaurant routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('GET api/v1/restaurants should return a list of restaurants', async () => {
    const resp = await request(app).get('/api/v1/restaurants');
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot();
  });
});
