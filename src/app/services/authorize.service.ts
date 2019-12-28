import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

@Injectable()
export class authorizeService {

  cachedRequests: Array<HttpRequest<any>> = [];

  public getToken(): string {
    const token = localStorage.getItem('token');
    return JSON.parse(token);
  }

  public getrefreshToken(): string {
    const refresh_token = localStorage.getItem('refresh_token');
    return JSON.parse(refresh_token);
  }

  public getExpiration(): number {
    const expiration = localStorage.getItem('expiration');
    return JSON.parse(expiration);
  }

  public isCurrent(): boolean {
    const expiration = this.getExpiration();
    if (expiration < Date.now()) {
      return false;
    }
    return true;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (token === null) {
      return false;
    }
    return true;
  }

  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }

}
