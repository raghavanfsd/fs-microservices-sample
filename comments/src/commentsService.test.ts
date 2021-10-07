import { CommentsService } from './commentsService';
import axios from 'axios';

describe('PostsService', () => {
  let commentsService: CommentsService;
  const port = 4001;
  const id = 1234;
  const COMMENTS_SERVICE_POST_URL = `http://localhost:${port}/posts/${id}/comments`;

  beforeAll(() => {
    commentsService = new CommentsService();
    commentsService.createPostRoute('/posts/:id/comments');
    commentsService.createGetRoute('/posts/:id/comments');
    commentsService.run(port);
  });

  afterAll(() => {
    commentsService.stop();
  });

  describe('POST Request tests', () => {
    it('makes a successful POST request and validates the response status', async () => {
      const resp = await axios.post(COMMENTS_SERVICE_POST_URL, {
        'content': 'My test comment',
      });
      expect(resp.status).toBe(201);
    });
  
    it('makes a successful POST request and validates the received data', async () => {
      const resp = await axios.post(COMMENTS_SERVICE_POST_URL, {
        'content': 'My test comment',
      });
      expect(resp.status).toBe(201);
      expect(resp.data.content).toBe('My test comment');
      expect(resp.data).toHaveProperty('id');

      const { data } = await axios.get(COMMENTS_SERVICE_POST_URL);
      console.log(data);
    });
  });

  describe('GET Request tests', () => {
    it('makes a successful GET request and validates the response status', async () => {      
      const resp = await axios.get(COMMENTS_SERVICE_POST_URL);
      expect(resp.status).toBe(200);
      expect(resp.data).toBeDefined();
    });

    it('makes a successful GET request and validates the received data', async () => {      
      const resp = await axios.get(COMMENTS_SERVICE_POST_URL);
      expect(resp.status).toBe(200);
      expect(resp.data).toBeDefined();
      expect(Object.keys(resp.data).length).toBe(2);
      
      expect(resp.data).toHaveProperty('postId');
      expect(resp.data).toHaveProperty('comments');
      expect(resp.data['postId']).toEqual(`${id}`);
      expect(resp.data['comments']).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            content: 'My test comment'
          })
        ])
      );
    });
  });
});
