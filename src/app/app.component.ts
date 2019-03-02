import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { authorizeService } from './services/authorize.service';
import { LoginService } from './services/login.service';
import { Globals } from './globals';

declare var require: any;
declare const ga: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [authorizeService, LoginService],
})
export class AppComponent implements AfterViewInit {
  public LOGO = require("../assets/logo.svg");
  private isAuthenticated: boolean = false;
  constructor(
    private router: Router,
    public authorizeService: authorizeService,
    public LoginService: LoginService,
    public globals: Globals,
  ) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // When a new page is navigated to, 
        // clear out the status message.
        this.globals.statusMessage = "";
      } 
    });
  }

  ngOnInit(): void {
    this.globals.statusMessage = "";
    if (this.authorizeService.isAuthenticated()) {
      this.globals.isAuthenticated = true;
    }
    else {
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