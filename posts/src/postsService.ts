import express, { Express, json, urlencoded } from 'express';
import { randomBytes } from 'crypto';
import { Server } from 'http';

interface Post {
  id: string;
  title: string;
}

type postMsgs  = Record<string, Post>;

export class PostsService {
  app: Express;
  server?: Server;
  posts: postMsgs;

  constructor() {
    this.posts = {};
    this.app = express();
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
  }

  createGetAllRoute(route: string): void {
    this.app.get(route, (req, res) => {
      return res.json(this.posts);
    });
  }

  createGetRoute(route: string): void {
    this.app.get(route, (req, res) => {
      const id = req.params.id;
      return res.send(this.posts[id]);
    });
  }

  createPostRoute(route: string): void {
    this.app.post(route, (req, res) => {
      const { title } = req.body;
      const id = randomBytes(4).toString('hex');
      const post = { id, title };

      console.log('post is -> ', post);
      this.posts[id] = post;
    
      return res.status(201).send(post);
    });
  }

  run(port: number): void {
    this.server = this.app.listen(port, () => 
      console.log(`server Listening on port ${port}`));
  }

  stop(): void {
    this.server?.close();
  }
}