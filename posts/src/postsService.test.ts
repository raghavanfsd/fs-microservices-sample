import { PostsService } from './postsService';
import axios from 'axios';

describe('PostsService', () => {
  let postsService: PostsService;
  const port = 4000;
  const POSTS_SERVICE_POST_URL = `http://localhost:${port}/posts`;

  beforeAll(() => {
    postsService = new PostsService();
    postsService.createGetAllRoute('/posts');
    postsService.createPostRoute('/posts');
    postsService.run(port);
  });

  afterAll(() => {
    postsService.stop();
  });

  describe('POST Request tests', () => {
    it('makes a successful POST request and validates the response status', async () => {
      const resp = await axios.post(POSTS_SERVICE_POST_URL, {
        'title': 'My test post',
      });
      expect(resp.status).toBe(201);
    });
  
    it('makes a successful POST request and validates the received data', async () => {
      const resp = await axios.post(POSTS_SERVICE_POST_URL, {
        'title': 'My test post',
      });
      expect(resp.status).toBe(201);
      expect(resp.data.title).toBe('My test post');
      expect(resp.data).toHaveProperty('id');

      const { data } = await axios.get(POSTS_SERVICE_POST_URL);
      console.log(data);
    });

  });
  
  describe('GET Request tests', () => {
    it('makes a successful GET request and validates the response status', async () => {      
      const resp = await axios.get(POSTS_SERVICE_POST_URL);
      expect(resp.status).toBe(200);
      expect(resp.data).toBeDefined();
    });

    it('makes a successful GET request and validates the received data', async () => {      
      const resp = await axios.get(POSTS_SERVICE_POST_URL);
      expect(resp.status).toBe(200);
      expect(resp.data).toBeDefined();
      expect(Object.keys(resp.data).length).toBe(2);
      Object.keys(resp.data).map(key => expect(resp.data[key]['id']).toEqual(key));
      Object.values(resp.data).map(entry => expect(entry).toHaveProperty('id'));
      Object.values(resp.data).map(entry => expect(entry).toHaveProperty('title'));
      Object.values(resp.data).map(entry => expect(entry).toEqual(
        expect.objectContaining({
          'title': 'My test post'
        })
      ));
    });
  });
});