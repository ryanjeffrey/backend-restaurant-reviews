const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Mock user for testing
const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

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
    expect(resp.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "cost": 1,
          "cuisine": "American",
          "id": "1",
          "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
          "name": "Pip's Original",
          "website": "http://www.PipsOriginal.com",
        },
        Object {
          "cost": 3,
          "cuisine": "Italian",
          "id": "2",
          "image": "https://media-cdn.tripadvisor.com/media/photo-m/1280/13/af/df/89/duck.jpg",
          "name": "Mucca Osteria",
          "website": "http://www.muccaosteria.com",
        },
        Object {
          "cost": 2,
          "cuisine": "Mediterranean",
          "id": "3",
          "image": "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/f2/e5/0c/dinner.jpg",
          "name": "Mediterranean Exploration Company",
          "website": "http://www.mediterraneanexplorationcompany.com/",
        },
        Object {
          "cost": 2,
          "cuisine": "American",
          "id": "4",
          "image": "https://media-cdn.tripadvisor.com/media/photo-o/0d/d6/a1/06/chocolate-gooey-brownie.jpg",
          "name": "Salt & Straw",
          "website": "https://saltandstraw.com/pages/nw-23",
        },
      ]
    `);
  });

  it('GET api/v1/restaurants/:restaurantId should return the restaurant with nested reviews', async () => {
    const resp = await request(app).get('/api/v1/restaurants/1');
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "cost": 1,
        "cuisine": "American",
        "id": "1",
        "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
        "name": "Pip's Original",
        "reviews": Array [
          Object {
            "detail": "Best restaurant ever!",
            "id": "1",
            "stars": 5,
            "userId": "1",
          },
          Object {
            "detail": "Terrible service :(",
            "id": "2",
            "stars": 1,
            "userId": "2",
          },
          Object {
            "detail": "It was fine.",
            "id": "3",
            "stars": 4,
            "userId": "3",
          },
        ],
        "website": "http://www.PipsOriginal.com",
      }
    `);
  });

  it('POST /api/v1/restaurants/:restaurantId/reviews should create a new review when logged in', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent
      .post('/api/v1/restaurants/3/reviews')
      .send({ stars: 5, detail: 'Best restaurant in town!' });
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot();
  });
});
