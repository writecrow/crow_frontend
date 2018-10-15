import { Router, ActivatedRoute, ParamMap } from '@angular/router';
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
    private API: APIService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.API.getPage(routeParams.id).subscribe(val => {
        this.title = val[0].title;
        this.body = val[0].body;
        this.isLoaded = true;
      });
    });
  }
}
