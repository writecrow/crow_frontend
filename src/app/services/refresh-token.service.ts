import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";

import { Observable, EMPTY } from 'rxjs';
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
  private client_text = environment.alt_text;
  private client_uuid = environment.alt_uuid;

  constructor(
    private http: HttpClient,
    public auth: authorizeService,
    private handleError: HandleErrorService,
    private router: Router
  ) { }

  refreshToken(): Observable<string> {
    const refreshAuth = this.auth.getrefreshToken();
    if (refreshAuth === null) {
      this.router.navigate(['/authorize']);
      return EMPTY;
    }
    const url: string = this.mainUrl + "oauth/token";
    // console.log('refresh ' + JSON.stringify(refreshAuth));

    const body = new FormData();
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", refreshAuth);
    body.append("client_id", this.client_text);
    body.append("client_secret", this.client_uuid);

    return this.http.post(url, body).pipe(map((token: Token) => {
        localStorage.setItem('token', JSON.stringify(token.access_token));
        localStorage.setItem('refresh_token', JSON.stringify(token.refresh_token));
        // console.log(JSON.stringify('new token from the service ' + token.refresh_token));
        return token.access_token;
      }));
  }



}
