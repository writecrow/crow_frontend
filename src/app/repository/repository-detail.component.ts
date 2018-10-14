import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { APIService } from '../services/api.service';
import { RepositoryDetail } from '../repository/repository-detail';

@Component({
  templateUrl: '../repository/repository-detail.component.html',
  styleUrls: ['../repository/repository-detail.component.css']
})

export class RepositoryDetailComponent implements OnInit {
  content : RepositoryDetail;
  isLoaded : boolean;

  constructor(
    private route: ActivatedRoute,
    private API: APIService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.API.getRepositoryDetail(routeParams.id).subscribe(response => {
        if (response && response[0]) {
          this.content = response[0];
          console.log(this.content);
          this.isLoaded = true;
        }
      });
    });
  }

}