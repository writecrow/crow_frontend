import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { RequestOptions } from '@angular/http';

import { Observable, empty } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Token } from '../services/tokenSchema';

import { HandleErrorService } from '../services/handle-error.service';
import { authorizeService } from './authorize.service';
import { Router } from '@angular/router';

@Injectable()
export class RefreshTokenService {
  // Enviroment variables from drupal site and client
  private mainUrl = environment.backend;
  private grant_type = environment.grant_type;
  private client_id = environment.client_id;
  private client_secret = environment.client_secret;

  constructor(
    private http: HttpClient, 
    public auth: authorizeService, 
    private handleError: HandleErrorService,
    private router: Router
  ) { }

  refreshToken(): Observable<string> {
    let refreshAuth = this.auth.getrefreshToken();
    if (refreshAuth === null) {
      this.router.navigate(['/authorize']);
      return empty();
    }
    let url: string = this.mainUrl + "oauth/token";
    // console.log('refresh ' + JSON.stringify(refreshAuth));

    let body = new FormData();
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", refreshAuth)
    body.append("client_id", this.client_id);
    body.append("client_secret", this.client_secret);

    return this.http.post(url, body).pipe(map((token: Token) => {
        localStorage.setItem('token', JSON.stringify(token.access_token));
        localStorage.setItem('refresh_token', JSON.stringify(token.refresh_token));
        //console.log(JSON.stringify('new token from the service ' + token.refresh_token));
        return token.access_token;
      }));
  }



}