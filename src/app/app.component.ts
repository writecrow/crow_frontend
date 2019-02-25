import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { authorizeService } from './authorize/authorize.service';
import { LoginService } from './services/login.service';
import { Globals } from './globals';

declare var require: any;
// declare google analytics
declare const ga: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [authorizeService, LoginService, Globals],
})
export class AppComponent implements AfterViewInit {
  public LOGO = require("../assets/logo.svg");
  private isAuthenticated: boolean = false;
  constructor(
    private router: Router,
    public authorizeService: authorizeService,
    public LoginService: LoginService,
    private globals: Globals,
  ) { }

  ngOnInit(): void {
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
    this.globals.isAuthenticated = false;
    this.LoginService.logout();
  }
  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // console.log(ga); // Just to make sure it's actually the ga function
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }
}