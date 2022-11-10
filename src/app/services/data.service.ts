import { Injectable, EventEmitter } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  apiURL: string = 'http://localhost:5000/api/';

  constructor(private _http: HttpClient) {}

  getData(
    apiMethod: string,
    params?: any,
    apiRoute: string = this.apiURL
  ): Observable<any> {
    let header = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http
      .get(apiRoute + apiMethod, { headers: header, params: params })
      .pipe(catchError(this.handleError));
  }

  async getDataPromise(
    apiMethod: string,
    params?: any,
    apiRoute: string = this.apiURL
  ): Promise<any> {
    let header = new HttpHeaders().set('Content-Type', 'application/json');

    return lastValueFrom(
      this._http.get(apiRoute + apiMethod, { headers: header, params: params })
    )
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  postData(
    apiMethod: string,
    body: any,
    params?: any,
    apiRoute: string = this.apiURL
  ): Observable<any> {
    let header = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http
      .post(apiRoute + apiMethod, body, {
        headers: header,
        params: params,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    //return throwError(err.message);
    //return throwError(err);
    return throwError(() => new Error(err.message));
  }
}
