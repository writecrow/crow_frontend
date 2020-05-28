import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeComponent } from '../authorize/authorize.component';

@Component({
  templateUrl: '../home/home.component.html',
  styleUrls: ['../home/home.component.css'],
  providers: [AuthorizeComponent],
})

export class HomeComponent implements OnInit {
  total_words: number;
  total_texts: number;
  homeFirstTitle: '';
  homeFirstBody: '';
  homeSecondTitle: '';
  homeSecondBody: '';

  constructor(
    private API: APIService,
    private route: ActivatedRoute,
    private router: Router,
    public authComponent: AuthorizeComponent,
  ) { }

  ngOnInit(): void {
    this.total_words = 7283469;
    this.total_texts = 8254;
    this.route.params.subscribe(() => {
      this.API.getPage('home-first').subscribe(response => {
        if (response && response[0]) {
          this.homeFirstTitle = response[0].title;
          this.homeFirstBody = response[0].body;
        }
      });
    });
    this.route.params.subscribe(() => {
      this.API.getPage('home-second').subscribe(response => {
        if (response && response[0]) {
          this.homeSecondTitle = response[0].title;
          this.homeSecondBody = response[0].body;
        }
      });
    });
    if (typeof this.route.snapshot.queryParams.auth !== 'undefined') {
      const auth = this.route.snapshot.queryParams.auth.split(':');
      if (auth[1]) {
        this.authComponent.authorize(auth[0].toLowerCase(), auth[1], '');
      }
    }
  }
}

