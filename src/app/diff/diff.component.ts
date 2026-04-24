import { authorizeService } from '../services/authorize.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { Globals } from '../globals';

@Component({
  templateUrl: '../diff/diff.component.html',
  styleUrls: ['../diff/diff.component.css']
})

export class DiffComponent implements OnInit {

  diff: string;
  before: string;
  after: string;
  width: string;
  format: string;
  isLoaded: boolean;
  statusMessage = "";

  constructor(
    private route: ActivatedRoute,
    public authorizeService: authorizeService,
    private router: Router,
    private API: APIService,
    public globals: Globals,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((routeParams) => {
      this.globals.inProgress = true;
      this.API.getDiff(routeParams).subscribe(response => {
        if (response) {
          this.diff = response.diff;
          this.before = response.before;
          this.after = response.after;
          this.format = routeParams.format ?? '';
          this.width = "col-lg-6";
          if (this.format == 'side-by-side' || this.format == '') {
            this.width = "col-lg-12";
          }
        } else {
          this.router.navigateByUrl('404', { skipLocationChange: true });
        }
        this.globals.inProgress = false;
      },
        err => {
          // Handle 500s.
          this.isLoaded = true;
          this.globals.inProgress = false;
        });
    });
  }

}
