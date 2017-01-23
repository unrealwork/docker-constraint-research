import * as express from 'express';
import {json, urlencoded} from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';

import {configurationRouter} from './routes/configuration';
import {statisticRouter} from './routes/statistic';
import {widgetRouter} from './routes/widget';
import {ratesRouter} from './routes/rates';

import {} from  './utils/client';
let atsdClient = require('./utils/client');
const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(compression());
app.use(urlencoded({extended: true}));





// api routes
app.use('/api/configuration', configurationRouter);
app.use('/api/statistic', statisticRouter);
app.use('/api/widget', widgetRouter);
app.use('/api/rates', ratesRouter);


app.use('/api/v1', function (req, res) {
  if (req.body == null) {
    atsdClient.request(req.url, req.method).pipe(res);
  } else {
    atsdClient.request(req.url, req.method, req.body).pipe(res);
  }
});

if (app.get('env') === 'production') {
  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, '/../client')));
}

// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next) {
  let err = new Error('Not Found');
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export {app}
