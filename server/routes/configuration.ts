import {Router, Response, Request} from 'express';
import * as _ from 'lodash';

const configurationRouter: Router = Router();
const CONFIGURATION_ENTITY = 'stressed-configurations';

let properties = require('../utils/client').properties;
let timeConstants = require('../utils/atsd-constants').time;


configurationRouter.get('/', (req: Request, res: Response) => {
  let type = req.query.type;
  if (type != null) {
    res.json({'type': type});
  } else {
    res.status(400);
    res.json({error: 'You need to specify a configurationRoute type'});
  }
});


configurationRouter.get('/types', (req: Request, res: Response) => {
  properties.getPropertyTypes(CONFIGURATION_ENTITY, function (error, response, body) {
    if (response.statusCode === 500) {
      res.json({error: 'Failed to get property from connected ATSD'});
    } else {
      res.status(response.statusCode);
      res.json(body);
    }
  });
});

configurationRouter.get('/types/:configurationType', (req: Request, res: Response) => {
  let type = req.params.configurationType;
  let payload = [{
    type: type,
    entity: CONFIGURATION_ENTITY,
    startDate: timeConstants.MIN_QUERIED_DATE,
    endDate: timeConstants.MAX_QUERIED_DATE
  }];
  properties.query(payload, function (error, response, body) {
    if (response.statusCode === 500) {
      res.json({error: 'Failed to get property from connected ATSD'});
    } else {
      res.status(response.statusCode);
      if (response.statusCode === 200) {
        res.json(_.map(body, propertyToConfiguration));
      } else {
        res.json(body);
      }
    }
  });
});


configurationRouter.get('/types/:configurationType/ids', (req: Request, res: Response) => {
  let type = req.params.configurationType;
  let payload = [{
    type: type,
    entity: CONFIGURATION_ENTITY,
    startDate: timeConstants.MIN_QUERIED_DATE,
    endDate: timeConstants.MAX_QUERIED_DATE
  }];
  properties.query(payload, function (error, response, body) {
    if (response.statusCode === 500) {
      res.json({error: 'Failed to get property from connected ATSD'})
    } else {
      res.status(response.statusCode);
      if (response.statusCode === 200) {
        let ids = [];
        body.forEach(function (element) {
          ids.push(element.key.id);
        });
        res.json(ids);
      } else {
        res.json(body);
      }
    }
  });
});


configurationRouter.get('/types/:configurationType/ids/:id', (req: Request, res: Response) => {
  let type = req.params.configurationType;
  let key = req.params.id;
  let payload = [{
    type: type,
    entity: CONFIGURATION_ENTITY,
    startDate: timeConstants.MIN_QUERIED_DATE,
    endDate: timeConstants.MAX_QUERIED_DATE,
    key: {
      id: key
    }
  }];
  properties.query(payload, function (error, response, body) {
    if (response.statusCode === 500) {
      res.json({error: 'Failed to get property from connected ATSD'});
    } else {
      res.status(response.statusCode);
      if (response.statusCode === 200) {
        if (body.length === 0) {
          res.status(404);
          res.json({
            error: 'Configuration with type: ' + type + ' and id: ' + key + ' not found'
          });
        } else {
          if (body.length === 1) {
            res.json(propertyToConfiguration(body[0]));
          } else {
            res.status(400);
            res.json({
              error: 'Too many configurations with type: ' + type + ' and id:' + key
            });
          }
        }
      } else {
        res.json(body);
      }
    }
  });
});

function propertyToConfiguration(property) {
  return {
    type: property.type,
    options: property.tags.options,
    period: {
      start: property.tags['start_time'],
      end: property.tags['end_time']
    }
  };
}

export {configurationRouter}
