import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {

  // This is based on https://scotch.io/bar-talk/error-handling-with-angular-6-tips-and-best-practices192
  // and https://blog.angular-university.io/rxjs-error-handling/
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
            console.log(errorMessage);
          } else {
            // Return the HTTP error response code to the subscriber.
            console.log(error.message);
            return throwError(error.status);
          }
          return throwError(errorMessage);
        })
      )
  }
}