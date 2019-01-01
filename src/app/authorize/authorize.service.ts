import { Injectable } from '@angular/core';
import { mockAuthorize } from '../authorize/mock.authorize';

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

}