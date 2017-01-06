import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Configuration} from '../models/configuration.interface';


@Injectable()
export class ConfigurationService {
  private baseUrl: string = 'api/configuration/';

  constructor(private http: Http) {
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

  getTypes(): Observable<string[]> {
    return this.http.get(this.baseUrl + '/types')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getConfigurations(type: string): Observable<Configuration[]> {
    return this.http.get(this.baseUrl + 'types/' + type)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
