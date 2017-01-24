import {Router, Response, Request} from 'express';
import {Period} from '../models/period.interface';

const ratesRouter: Router = Router();
let series = require('../utils/client').series;

const DEFAULT_ENTITY = 'dkr.axibase.com';

const typeMetricDictionary = {
  'cpu-usage': 'docker.cpu.avg.usage.total.percent'
};


const containersEntities = {
  mysql: 'efb3cafb53162b12fdfd370b11b6881ab5f3425cc46a4b7ca4c11cf525e80452',
  overall: 'nurswgdkr001'
};

const rates = ['cpu-usage'];

/**
 * get some rates for period
 */

ratesRouter.get('/', (req: Request, res: Response) => {
  res.json(rates);
});

ratesRouter.post('/:type/host', (req: Request, res: Response) => {
  let type: string = req.params.type;
  let period: Period = req.body;
  let queries: any[] = [];
  let payload = [{
    metric: 'docker.cpu.sum.usage.total.percent',
    entity: containersEntities.overall,
    startDate: period.start,
    endDate: period.end,
    tags: {}
  }];
  console.log(JSON.stringify(payload));
  queries.push(payload);

  series.query(payload, (err, response, seriesList) => {
    let result: any[] = [];
    for (let s of  seriesList) {
      result.push(extractStatistic(s.data, 'host'));
    }
    res.json(result);
  });
});

ratesRouter.post('/:type/priority', (req: Request, res: Response) => {
  let type: string = req.params.type;
  let period: Period = req.body;
  let queries: any[] = [];
  let payload = [{
    metric: 'docker.cpu.avg.usage.total.percent',
    entity: containersEntities.mysql,
    startDate: period.start,
    endDate: period.end,
    aggregate: {
      type: 'AVG',
      period: aggregationPeriod(period)
    },
    tags: {
      'docker-host': containersEntities.overall
    }
  }];
  console.log(JSON.stringify(payload));
  queries.push(payload);

  series.query(payload, (err, response, seriesList) => {
    let result: any[] = [];
    for (let s of  seriesList) {
      result.push(extractStatistic(s.data, 'mysql'));
    }
    res.json(result);
  });
});


function extractStatistic(samples: any, type: any): any {
  // return middle value
  return {
    process: type,
    value: Math.round(samples[~~(samples.length / 2)].v * 100) / 100
  };
}

function aggregationPeriod(period: Period) {
  return {
    count: Date.parse(period.end) - Date.parse(period.start),
    unit: 'MILLISECOND',
    align: 'START_TIME'
  };
}

export {ratesRouter};
