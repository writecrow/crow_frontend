import { authorizeService } from './services/authorize.service';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Globals } from './globals';
import { environment } from '../environments/environment';
import { LoginService } from './services/login.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

declare var require: any;
declare const ga: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [authorizeService, LoginService],
})
export class AppComponent implements AfterViewInit, OnInit {

  constructor(
    private router: Router,
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
    } else {
      this.globals.isAuthenticated = false;
    }
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
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }
}
