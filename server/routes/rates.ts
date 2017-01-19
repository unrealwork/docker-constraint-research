import {Router, Response, Request} from 'express';
import {Period} from '../models/period.interface';

const ratesRouter: Router = Router();
let series = require('../utils/client').series;

const DEFAULT_ENTITY = 'docker-constraint';

const typeMetricDictionary = {
  'response-time': 'jmeter.mysql-response-time'
};

const rates = ['cpu-usage'];

/**
 * get some rates for period
 */

ratesRouter.get('/', (req: Request, res: Response) => {
  res.json(rates);
});

function extractStatistic(samples: any, type: any): any {
  // return middle value
  return {
    statistic: type,
    value: samples[~~(samples.length / 2)].v
  };
}

export {ratesRouter};
