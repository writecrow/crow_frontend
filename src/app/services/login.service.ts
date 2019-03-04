import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Token } from '../services/tokenSchema';
import { HandleErrorService } from './handle-error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestCache } from '../services/request-cache.service';
import { Globals } from '../globals';

@Injectable()
export class LoginService {
  private mainUrl = environment.backend;  // URL to web api
  private grant_type = "password"
  private client_text = environment.alt_text;
  private client_uuid = environment.alt_uuid;

  constructor(
    private http: HttpClient,
    private handleError: HandleErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private requestCache: RequestCache,
    private globals: Globals
  ) { }

  login(user, pass): Observable<Token> {
    const url = `${this.mainUrl}oauth/token`;
    let body = new FormData();
    body.append("grant_type", this.grant_type);
    body.append("client_id", this.client_text);
    body.append("client_secret", this.client_uuid);
    body.append("username", user);
    body.append("password", pass);
    return this.http.post(url, body).pipe(map((token: Token) => {
      localStorage.setItem('token', JSON.stringify(token.access_token));
      localStorage.setItem('expiration', JSON.stringify(token.expires_in * 1000 + Date.now()))
      localStorage.setItem('refresh_token', JSON.stringify(token.refresh_token));
      return token
    }), 
    catchError(this.handleError.handleError));
  }

  logout() {
    this.globals.isAuthenticated = false;
    this.requestCache.clearAll();
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token'); 
    return empty();
  }

}