import { APIService } from './services/api.service';
import { authorizeService } from './services/authorize.service';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Globals } from './globals';
import { environment } from '../environments/environment';
import { LoginService } from './services/login.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

declare var require: any;
declare const gtag: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [authorizeService, LoginService],
})
export class AppComponent implements AfterViewInit, OnInit {

  downloadUrl = false;

  constructor(
    private router: Router,
    private API: APIService,
    public authorizeService: authorizeService,
    public LoginService: LoginService,
    public globals: Globals,
    private sanitizer: DomSanitizer,
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // When a new page is navigated to, clear out the status message.
        this.globals.statusMessage = "";
      }
      if (event instanceof NavigationEnd) {
        this.globals.previousUrl = this.globals.currentUrl;
        this.globals.currentUrl = event.url;
      }
    });
  }

  ngOnInit(): void {
    this.globals.authenticating = false;
    this.globals.statusMessage = "";
    if (this.authorizeService.isAuthenticated()) {
      this.globals.isAuthenticated = true;
    }
    else {
      this.globals.isAuthenticated = false;
    }
    this.API.getRoles().subscribe(response => {
      if (response) {
        if (response.includes('offline')) {
          this.downloadUrl = true;
        }
      }
    });
  }
  signIn(): void {
    this.router.navigate(['/authorize']);
  }
  signOut(): void {
    this.LoginService.logout();
    this.router.navigate(['/']);
  }
  exitStatus(): void {
    this.globals.statusMessage = "";
  }
  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('set', 'page', event.urlAfterRedirects);
        gtag('send', 'pageview');
      }
    });
  }
}
