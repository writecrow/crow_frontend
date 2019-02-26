import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Token } from '../services/tokenSchema';
import { HandleErrorService } from './handle-error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestCache } from '../services/request-cache.service';

@Injectable()
export class LoginService {
  private mainUrl = environment.backend;  // URL to web api
  private grant_type = environment.grant_type;
  private client_id = environment.client_id;
  private client_secret = environment.client_secret;

  constructor(
    private http: HttpClient,
    private handleError: HandleErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private requestCache: RequestCache 
  ) { }

  login(user, pass): Observable<Token> {
    const url = `${this.mainUrl}oauth/token`;
    let body = new FormData();
    body.append("grant_type", this.grant_type);
    body.append("client_id", this.client_id);
    body.append("client_secret", this.client_secret);
    body.append("username", user);
    body.append("password", pass);
    return this.http.post(url, body).pipe(map((token: Token) => {
      localStorage.setItem('token', JSON.stringify(token.access_token));
      localStorage.setItem('refresh_token', JSON.stringify(token.refresh_token));
      return token
    }), 
    catchError(
      this.handleError.handleError));
  }

  logout() {
    this.requestCache.clearAll();
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token'); 
    return empty();
  }

}