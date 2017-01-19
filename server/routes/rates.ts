import {Router, Response, Request} from 'express';
import {Period} from '../models/period.interface';

const ratesRouter: Router = Router();
let series = require('../utils/client').series;

const DEFAULT_ENTITY = 'dkr.axibase.com';

const typeMetricDictionary = {
  'cpu-usage': 'proc_stat.cpu_usage'
};

const rates = ['cpu-usage'];

/**
 * get some rates for period
 */

ratesRouter.get('/', (req: Request, res: Response) => {
  res.json(rates);
});

ratesRouter.post('/:type', (req: Request, res: Response) => {
  let type: string = req.params.type;
  let period: Period = req.body;

  let payload = {
    metric: typeMetricDictionary[type],
    entity: DEFAULT_ENTITY,
    startDate: period.start,
    endDate: period.end
  };

  series.query(payload, (err, response, seriesList) => {
    let result: any[] = [];
    for (let s of  seriesList) {
      result.push(
        {
          process: s.tags[Object.keys(s.tags)[0]],
          value: s.data[~~(s.data.length / 2)].v
        }
      );
    }
    res.json(result);
  });
});

function extractStatistic(samples: any, type: any): any {
  // return middle value
  return {
    process: type,
    value: samples[~~(samples.length / 2)].v
  };
}

export {ratesRouter};
