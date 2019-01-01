import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare var require: any;
// declare google analytics
declare const ga: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public LOGO = require("../assets/logo.svg");
  constructor(private router: Router) { }

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