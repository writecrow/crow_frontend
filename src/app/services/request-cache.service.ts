// The cache implementation below follows https://fullstack-developer.academy/caching-http-requests-with-angular/
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

const maxAge = 30000;
@Injectable()
export class RequestCache {

  cache = new Map();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached) {
      if (environment.production === false) {
        console.log('New request:' + url);
      }
      return undefined;
    }
    if (environment.production === false) {
      console.log('Cached: ' + url);
    }
    const isExpired = cached.lastRead < (Date.now() - maxAge);
    const expired = isExpired ? 'expired ' : '';
    return cached.response;
  }

  clearAll(): void {
    this.cache.clear();
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    // Do not cache authorizations.
    if (typeof response.body.access_token === "undefined" && response.status == 200) {
      const url = req.url;
      const entry = { url, response, lastRead: Date.now() };
      this.cache.set(url, entry);
      const expired = Date.now() - maxAge;
      this.cache.forEach(expiredEntry => {
        if (expiredEntry.lastRead < expired) {
          this.cache.delete(expiredEntry.url);
        }
      });
    }
  }
}
