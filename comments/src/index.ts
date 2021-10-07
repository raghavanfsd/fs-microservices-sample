import { CommentsService } from './commentsService';

const COMMENTS_SERVICE_PORT = 4001;
const ROUTE_STR = '/posts/:id/comments';
const commentsService = new CommentsService();

commentsService.createPostRoute(ROUTE_STR);
commentsService.createGetRoute(ROUTE_STR);


commentsService.run(COMMENTS_SERVICE_PORT);