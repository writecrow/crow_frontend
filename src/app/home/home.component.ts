import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeComponent } from '../authorize/authorize.component';
import * as baseData from '../corpus/corpus-base.json';

@Component({
  templateUrl: '../home/home.component.html',
  styleUrls: ['../home/home.component.css'],
  providers: [AuthorizeComponent],
})

export class HomeComponent implements OnInit {
  total_words: number;
  total_texts: number;
  newsItems = [];
  homeFirstTitle: string;
  homeFirstBody: string;
  homeSecondTitle: string;
  homeSecondBody: string;
  corpusBase = (baseData as any).default;

  constructor(
    private API: APIService,
    private route: ActivatedRoute,
    private router: Router,
    public authComponent: AuthorizeComponent,
  ) { }

  ngOnInit(): void {
    this.total_words = this.corpusBase.pager.subcorpus_wordcount.toLocaleString();
    this.total_texts = this.corpusBase.pager.total_items.toLocaleString();
    this.route.params.subscribe(() => {
      this.API.getWriteCrowNews().subscribe(response => {
        if (response && response[0]) {
          let count = 0;
          for (const i of response) {
            const date = this.formatDate(i.date);
            this.newsItems.push({
              'title': i.title.rendered.replace('&#8217;', "'").replace('&#8220;', '"').replace('&#8221;', '"').replace('&#8217;', '"').replace('&hellip;', "...").replace('&#038;', '&'),
              'link': i.link,
              'date': date,
              'summary': this.shorten(i.excerpt.rendered.replace('&#8217;', "'").replace('&#8220;', '"').replace('&#8221;', '"').replace('&#8217;', '"').replace('&hellip;', "...").replace(/(<([^>]+)>)/ig, "").replace("Read more &#8250;", ""), 300, " "),
            });
            count = count + 1;
            if (count === 5) {
              break;
            }
          }
        }
      });
    });
    // this.route.params.subscribe(() => {
    //   this.API.getPage('home-first').subscribe(response => {
    //     if (response && response[0]) {
    //       this.homeFirstTitle = response[0].title;
    //       this.homeFirstBody = response[0].body;
    //     }
    //   });
    // });
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

  // Shorten a string to less than maxLen characters without truncating words.
  shorten(str, maxLen, separator = ' ') {
    if (str.length <= maxLen) {
      return str;
    }
    return str.substr(0, str.lastIndexOf(separator, maxLen)) + '...';
  }

  formatDate(date) {
    const d = new Date(date);
    const month = d.toLocaleString('default', { month: 'long' });
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (day.length < 2) {
      day = '0' + day;
    }
    return month + ' ' + day + ', ' + year;
  }
}

