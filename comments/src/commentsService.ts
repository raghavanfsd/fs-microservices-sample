import express, { Express, json, urlencoded } from 'express';
import cors from 'cors';
import { randomBytes } from 'crypto';
import { Server } from 'http';

interface Comment {
  id: string;
  content: string;
}

interface Comments {
  postId: string,
  comments: Comment[];
}

type CommentsType = Record<string, Comments>;

export class CommentsService {
  app: Express;
  server?: Server;
  comments: CommentsType;

  constructor() {
    this.app = express();
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(cors());
  
    this.comments = {};
  }

  createPostRoute(route: string): void {
    this.app.post(route, (req, res) => {
      const postId = req.params.id;
      if (!postId) {
        res.status(400).send('Post Id is required');
      } else {
        const { content } = req.body;
        const id = randomBytes(4).toString('hex');
        const comments: Comment[] = this.comments[postId]?.comments ?? [];
        const comment = { id, content };
        
        comments.push(comment);
        console.log('new comment for the post id: ', postId, ' is -> ', comment);

        this.comments[postId] = { postId: postId, comments };

        return res.status(201).send(comment);
      }
    });
  }

  createGetRoute(route: string): void {
    this.app.get(route, (req, res) => {
      const postId = req.params.id;
      if (!postId) {
        res.status(400).send('Post Id is required');
      } else {
        return res.send(this.comments[postId]);
      }
    });
  }

  run(port: number): void {
    this.server = this.app.listen(port, () => 
      console.log(`CommentsService is listening on port ${port}`));
  }

  stop(): void {
    this.server?.close();
  }
}
