// This file is based on the canonical example from
// https://github.com/angular/angular/blob/master/aio/content/examples/http/src/app/http-interceptors/caching-interceptor.ts
// as well as a simplified version in
// https://fullstack-developer.academy/caching-http-requests-with-angular/
import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { RequestCache } from '../services/request-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private doNotCache = [];

  constructor(private cache: RequestCache) {
    this.doNotCache = [
      'user-change-request.+',
      'submit-issue.+',
      'api/account.+',
      'user/roles.+',
    ];
  }


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const cachedResponse = this.cache.get(req);
    // cache-then-refresh
    if (req.headers.get('x-refresh')) {
      const results$ = this.sendRequest(req, next, this.cache);
      return cachedResponse ?
        results$.pipe(startWith(cachedResponse)) :
        results$;
    }
    // Return a cached version, or fetch the request if no cache.
    return cachedResponse ?
      of(cachedResponse) : this.sendRequest(req, next, this.cache);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCache): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse && this.isCacheable(req.url)) {
          cache.put(req, event);
        }
      })
    );
  }

  private isCacheable(requestUrl: string): boolean {
    for (let address of this.doNotCache) {
      if (new RegExp(address).test(requestUrl)) {
        return false;
      }
    }
    return true;
  }
}
