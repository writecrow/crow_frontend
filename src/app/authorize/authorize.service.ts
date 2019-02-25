import { Injectable } from '@angular/core';
import { mockAuthorize } from '../authorize/mock.authorize';
import { HttpRequest } from '@angular/common/http';

export class authorizeService {

  constructor() { }

  checkAuth(username, password): boolean {
    for (var i in mockAuthorize) {
      if (mockAuthorize[i].user.toLowerCase() == username && mockAuthorize[i].pass.toLowerCase() == password) {
        return true;
      }
    }
    return false;
  }

  public getToken(): string {
    const token = localStorage.getItem('token');
    return JSON.parse(token);
  }

  // I need my refresh token function here. 
  public getrefreshToken(): string {
    const refresh_token = localStorage.getItem('refresh_token');
    return JSON.parse(refresh_token);
  }

  public isAuthenticated(): boolean {
    // console.log (localStorage['token']);
    const token = this.getToken();
    // Check whether the token is expired and return true or false
    // @todo.
    if (token === null) {
      return false;
    }
    return true;
  }

  cachedRequests: Array<HttpRequest<any>> = [];

  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }

}