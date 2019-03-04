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
  total_words : number;
  total_texts : number;

  constructor(
    private API: APIService,
    private route: ActivatedRoute,
    private router: Router,
    public authComponent: AuthorizeComponent,
  ) { }

  ngOnInit(): void {
    this.total_words = 7283469;
    this.total_texts = 8254;
    if (typeof this.route.snapshot.queryParams.auth !== 'undefined') {
      var auth = this.route.snapshot.queryParams.auth.split(":");
      if (auth[1]) {
        this.authComponent.authorize(auth[0].toLowerCase(), auth[1], '');
      }
    }
  }
}

