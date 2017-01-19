import {Router, Response, Request} from 'express';
import {Period} from '../models/period.interface';
import {StatisticType} from '../models/statistictype.enum';

const statisticRouter: Router = Router();
let series = require('../utils/client').series;

const DEFAULT_ENTITY = 'docker-constraint';

const typeMetricDictionary = {
  'response-time': 'jmeter.mysql-response-time'
};

const tagStatisticDictionary = {
  avg: 'all.all.mean',
  min: 'all.all.min',
  max: 'all.all.max',
  pct90: 'all.all.pct90',
  pct95: 'all.all.pct95',
  pct99: 'all.all.pct99'
};

/**
 * get statistic samples
 */

statisticRouter.post('/:name', (req: Request, res: Response) => {
  let name: string = req.params.name;
  let type: string = req.params.type;
  let period: Period = req.body;


  if (typeMetricDictionary.hasOwnProperty(name)) {
    let payload = [{
      entity: DEFAULT_ENTITY,
      metric: typeMetricDictionary[name],
      tags: {
        id: tagStatisticDictionary[type]
      },
      startDate: period.start,
      endDate: period.end
    }];
    series.query(payload, function (err, response, body) {
      if (response.statusCode !== 200) {
        res.status(400);
        res.json({
          error: 'Incorrect params of query'
        });
      } else {
        let result: any[] = [];
        body.forEach((s: any) => {
          for (let tag in tagStatisticDictionary) {
            if (s.tags.id === tagStatisticDictionary[tag]) {
              result.push(extractStatistic(s.data, tag));
              break;
            }
          }
        });
        res.json(result);
      }
    });
  } else {
    res.status(400);
    res.json({
      error: 'Incorrect type of statistic'
    });
  }
});


statisticRouter.post('/:name/:type', (req: Request, res: Response) => {
  let name: string = req.params.name;
  let type: string = req.params.type;
  let period: Period = req.body;


  if (typeMetricDictionary.hasOwnProperty(name)) {
    let payload = [{
      entity: DEFAULT_ENTITY,
      metric: typeMetricDictionary[name],
      tags: {
        id: tagStatisticDictionary[type]
      },
      startDate: period.start,
      endDate: period.end
    }];
    series.query(payload, function (err, response, body) {
      if (response.statusCode !== 200) {
        res.status(400);
        res.json({
          error: 'Incorrect params of query'
        });
      } else {
        res.json(extractStatistic(body[0].data, type));
      }
    });
  } else {
    res.status(400);
    res.json({
      error: 'Incorrect type of statistic'
    });
  }
});

function extractStatistic(samples: any, type: any): any {
  // return middle value
  return {
    statistic: type,
    value: samples[~~(samples.length / 2)].v
  };
}

export {statisticRouter};
