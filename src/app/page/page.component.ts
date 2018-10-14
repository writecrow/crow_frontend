import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { APIService } from '../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Component({
  templateUrl: '../page/page.component.html',
  styleUrls: ['../page/page.component.css']
})

export class PageComponent implements OnInit {
  title;
  body;
  total;
  selectedId:string;

  constructor(
    private route: ActivatedRoute,
    private API: APIService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.API.getPage(routeParams.id).subscribe(val => {
        console.log(val[0].title)
        this.title = val[0].title;
        this.body = val[0].body;
      });
    });
  }
}
