import {Router, Response, Request} from 'express';
import {Period} from "../models/period.interface";
const widgetRouter = Router();

widgetRouter.post('/response-time', (req: Request, res: Response) => {
  let period: Period = req.body;
  try {
    let startMs: number = Date.parse(period.start);
    let endMs: number = Date.parse(period.end);
    let config = {
      initSize: {width: 1600, height: 600},
      timespan: (endMs - startMs - 15000) + ' millisecond',
      timezone: "UTC",
      displaypanels: 'true',
      endtime: period.end,
      minrange: 0,
      series: [{
        entity: 'docker-constraint',
        metric: 'jmeter.mysql-response-time',
        tags: {
          id: 'all.all.max'
        }
      }],
      url: "http://localhost:4000"
    };
    res.json(config)
  } catch (e) {
    console.log("Failed to parse start or period date");
    res.status(400)
  }
});

export {widgetRouter};
