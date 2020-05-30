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
    this.homeFirstTitle = "What's New";
    this.homeFirstBody = '<ul><li>November 2: Arizona Teachers of English to Speakers of Other Languages, "<a href="https://sched.co/WSnI">Bridging L2 writing and academic vocabulary through corpus-based activities</a>"</li><li>November 15: Symposium on Second Language Writing, "<a href="https://sched.co/TKQ0">Using a learner corpus and a repository of pedagogical materials for L2 writing research and teaching</a>"</li><li>March 31, 2020:&nbsp;<a href="https://www.tesol.org/convention-2020/schedule-at-a-glance">TESOL 2020</a></li></ul>';
    this.homeSecondTitle = 'Resources & Tutorials';
    this.homeSecondBody = '<p><strong>Writing Models</strong></p><ul><li><a href="https://crow.corporaproject.org/page/students">Compare how other writers use an English idiom</a></li></ul><p><strong>Lesson Planning</strong></p><ul><li><a href="https://crow.corporaproject.org/page/teachers">Find sample sentences for a lesson on signal phrases</a></li></ul><p><strong>Research &amp; Analysis</strong></p><ul><li><a href="https://crow.corporaproject.org/page/researchers">Export Crow data for statistical analysis in R</a></li><li><a href="https://crow.corporaproject.org/page/researchers">Perform machine-driven queries with the API</a></li></ul><p><strong>Corpus Building</strong></p><ul><li><a href="https://crow.corporaproject.org/page/developers">Develop a similar corpus using the source code</a></li></ul>';
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

