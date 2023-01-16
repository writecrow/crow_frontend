import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { authorizeService } from '../services/authorize.service';
import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';

@Component({
  templateUrl: '../accesschange/accesschange.component.html',
  styleUrls: ['../accesschange/accesschange.component.css']
})

export class AccessChangeComponent implements OnInit {
  public roles = [];
  role = '';
  model: any = {};

  constructor(
    private route: ActivatedRoute,
    public authorizeService: authorizeService,
    private router: Router,
    private API: APIService,
    public globals: Globals,
  ) { }

  ngOnInit(): void {
    if (!this.authorizeService.isAuthenticated()) {
      // If not authorized, redirect to the login page.
      this.router.navigate(['/authorize']);
    }
    this.route.params.subscribe((routeParams) => {
      let allowed_roles = ['fulltext', 'export', 'offline'];
      if (typeof routeParams.role !== 'undefined' && allowed_roles.includes(routeParams.role)) {
        this.role = routeParams.role;
      }
      else {
        this.router.navigate(['/account']);
      }
    });
  }

  public onSubmit(description) {
    this.API.postRequest('user-change-request', {
      role: this.role,
      description: description,
    }).subscribe(response => {
      if (response.status == null) {
        this.router.navigateByUrl(this.globals.previousUrl);
        this.globals.statusMessage = 'Your access request has been sent. Expect to hear from us soon.';
      }
    });
  }
}
