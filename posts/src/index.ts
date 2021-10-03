import { PostsService } from './postsService';

const POSTS_SERVICE_PORT = 4000;
const ROUTE_STR = '/posts';
const postsService = new PostsService();

postsService.createPostRoute(ROUTE_STR);
postsService.createGetAllRoute(ROUTE_STR);
postsService.createGetRoute(ROUTE_STR + '/:id');


postsService.run(POSTS_SERVICE_PORT);