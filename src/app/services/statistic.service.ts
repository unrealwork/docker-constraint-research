import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Period} from '../models/period.interface';
import {Metric} from '../models/metric.enum';
import {StatisticType} from '../models/statistictype.enum';
import {Statistic} from "../models/statitistic.interface";


@Injectable()

export class StatisticService {
  private baseUrl = 'api/statistic/';

  constructor(private http: Http) {
  }

  getStatistic(metric: Metric, period: Period, type: StatisticType): Observable<Statistic> {
    return this.http.post(this.baseUrl + '/' + metric + '/' + type, period)
      .map(data => {
        return {
          type: type,
          value: data.json().value
        };
      })
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
