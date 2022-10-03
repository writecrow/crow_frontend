import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, EMPTY, throwError } from 'rxjs';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';

import { RefreshTokenService } from '../services/refresh-token.service';
import { authorizeService } from '../services/authorize.service';
import { LoginService } from '../services/login.service';
import { Globals } from '../globals';

@Injectable()
// HttpInterceptor interface.
export class RequestInterceptor implements HttpInterceptor {

  password_reset_url = environment.backend + 'user/password';
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private authService: authorizeService,
    public login: LoginService,
    private refreshToken: RefreshTokenService,
    private globals: Globals
  ) { }
  // Add a token to the header on each call and catch HTTP response errors.
  // Note: the backend must be set to allow such headers.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    // In the intercept method, we return next.handle and pass in the cloned request with a header added.
    return next.handle(this.addToken(req, this.authService.getToken())).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          this.globals.authenticating = false;
          switch ((<HttpErrorResponse>error).status) {
            case 400:
            case 401:
              // Response code 400 is also considered invalid username/password. See https://stackoverflow.com/q/22586825
              return this.handle401(error);
            case 403:
              return this.handle403(error, req, next);
            case 500:
            case 0:
              return this.handle500(error);
            default:
              // console.log(error);
              return throwError(error);
          }
        } else {
          return throwError(error);
        }
      }));
  }
  // Add the Bearer token to the Authorization header.
  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token == null) {
      return req;
    }
    else {
      return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
    }
  }

  handle403(error, req: HttpRequest<any>, next: HttpHandler) {
    if (this.authService.isCurrent()) {
      this.globals.statusMessage = "Your account does not have access to this content.";
      return EMPTY;
    }
    if (!this.authService.isAuthenticated()) {
      this.globals.statusMessage = "Your account does not have access to this content.";
      return EMPTY;
    }
    console.log('Attempting to re-authenticate');
    // If isRefreshingToken is false (which it is by default) we will
    // enter the code section that calls authService.refreshToken
    if (!this.isRefreshingToken) {
      // Immediately set isRefreshingToken to true so no more calls
      // come in and call refreshToken again – which we don’t want of course
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      // Call authService.refreshToken (this is an Observable that will be returned)
      return this.refreshToken.refreshToken().pipe(
        switchMap((newToken: string) => {
          if (newToken) {
            // When successful, call tokenSubject.next on the new token,
            // this will notify the API calls that came in after the refreshToken
            // call that the new token is available and that they can now use it
            this.tokenSubject.next(newToken);
            // Return next.handle using the new token
            return next.handle(this.addToken(req, newToken));
          }
          // If we don't get a new token, we are in trouble so logout.
          return this.login.logout();
        }),
        catchError(error => {
          // If there is an exception calling 'refreshToken', so assume
          // the user is authenticated but still doesn't have access.
          this.globals.statusMessage = "Your account does not have access to this content.";
          return EMPTY;
        }),
        finalize(() => {
          // When the call to refreshToken completes, in the finalize block,
          // reset the isRefreshingToken to false for the next time the token needs to be refreshed
          this.isRefreshingToken = false;
        }));
      // Note that no matter which path is taken, we must return an Observable that ends up
      // resolving to a next.handle call so that the original call is matched with the altered call
    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null)
        // Only take 1 here to avoid returning two – which will cancel the request
        , take(1)
        , switchMap(token => {
          // When the token is available, return the next.handle of the new request
          return next.handle(this.addToken(req, token));
        }));
    }
  }

  handle401(error) {
    this.globals.authenticating = false;
    this.globals.inProgress = false;
    this.globals.statusMessage = 'The username/password combination was not accepted. <a href="' + this.password_reset_url + '">Forgot your password</a>?';
    // Usually caused by not making any API calls for whatever the timeout is configured for.
    if (error && error.status === 401 || error.error && error.error.error === 'invalid_grant') {
      // If 401 and the error message is 'invalid_grant',
      // the token is no longer valid so logout.
      return this.login.logout();
    }
    return throwError(error);
  }

  handle500(error) {
    this.globals.authenticating = false;
    this.globals.inProgress = false;
    // Usually caused by a server-side error.
    this.globals.statusMessage = 'There was a problem completing this request. You can wait a moment and try again; if the problem persists, please report it to <a href="mailto: collaborate@writecrow.org">collaborate@writecrow.org</a> and we will look into it.';
    return throwError(error);
  }


}
