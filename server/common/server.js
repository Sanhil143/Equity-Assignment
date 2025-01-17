import Express from 'express';
import * as path from 'path';
import * as http from 'http';
import cors from 'cors';
import * as os from 'os';
import l from './logger';
import oas from './swagger';

const app = new Express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);

    app.use(Express.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      Express.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
    app.use(cors());
    app.use(Express.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(Express.static(`${root}/public`));
  }

  router(routes) {
    this.routes = routes;
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );

    oas(app, this.routes)
      .then(() => {
        http.createServer(app).listen(port, welcome(port));
      })
      .catch((e) => {
        l.error(e);
        // eslint-disable-next-line, no-process-exit
        process.exit(1);
      });

    return app;
  }
}
