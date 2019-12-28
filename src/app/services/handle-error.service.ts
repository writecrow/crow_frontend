// this service will handle error:
// 401 Unauthorized
// 403 forbiden
// 40? for refresh token
import { Injectable } from '@angular/core';
// import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Globals } from '../globals';

@Injectable()
export class HandleErrorService {

  constructor(
    private http: HttpClient,
    private globals: Globals,
    ) { }
  public handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      // A client-side or network error occurred.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      if (err.status == 401) {
        errorMessage = `Invalid credentials, ${err.error.message}`;
      }
      if (err.status == 403) {
        errorMessage = `Forbiden loser!!, ${err.error.message}`;
      }
    }
    return Observable.throw(errorMessage);
  }
}
