import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: '../page/page.component.html',
  styleUrls: ['../page/page.component.css']
})

export class PageComponent implements OnInit {
  title: string;
  body: string;
  isLoaded: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.API.getPage(routeParams.id).subscribe(response => {
        if (response && response[0]) {
          this.title = response[0].title;
          this.body = response[0].body;
          this.isLoaded = true;
        }
        else {
          this.router.navigateByUrl('404', { skipLocationChange: true });
        }
      });
    });
  }
}
