import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { authorizeService } from '../authorize/authorize.service';


@Component({
  templateUrl: '../home/home.component.html',
  styleUrls: ['../home/home.component.css'],
  providers: [authorizeService],
})

export class HomeComponent implements OnInit {
  total_words : number;
  total_texts : number;

  constructor(
    private API: APIService,
    private route: ActivatedRoute,
    private router: Router,
    public authorizeService: authorizeService,
  ) { }

  ngOnInit(): void {
    this.total_words = 7287456;
    this.total_texts = 700;
    if (typeof this.route.snapshot.queryParams.auth !== 'undefined') {
      var auth = this.route.snapshot.queryParams.auth.split(":");
      if (auth[1]) {
        var allowed = this.authorizeService.checkAuth(auth[0], auth[1]);
        if (allowed) {
          localStorage.setItem('crowAuthenticate', 'yes');
          this.router.navigateByUrl('/');
        }
      }
    }
    if (typeof this.route.snapshot.queryParams.auth !== 'undefined') {
      var auth = this.route.snapshot.queryParams.auth.split(":");
      if (auth[1]) {
        var allowed = this.authorizeService.checkAuth(auth[0], auth[1]);
        if (allowed) {
          localStorage.setItem('crowAuthenticate', 'yes');
          this.router.navigateByUrl('/');
        }
      }
    }
    // Pre-load the corpus search data, in part to get the total
    // number of texts, and also for faster perceived loading when
    // users navigate to the corpus (results already cached).
    this.API.getDefaultCorpusSearchResults().subscribe((response) => {
      if (typeof response !== 'undefined' && response.pager) {
        this.total_texts = response.pager.total_items;
        this.total_words = response.pager.subcorpus_wordcount;
      }
    });
  }
}

