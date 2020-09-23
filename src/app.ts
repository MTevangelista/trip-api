import express from 'express';

import routes from './routes';

class App {
  public app: express.Application;

  public constructor() {
    this.app = express();

    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use(routes);
  }
}

export default new App().app;