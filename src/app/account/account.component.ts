import { authorizeService } from '../services/authorize.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';

@Component({
  templateUrl: '../account/account.component.html'
})

export class AccountComponent implements OnInit {

  public full_name = '';
  public name = '';
  public mail = '';
  public roles = [];
  public created = '';
  public field_project_complete_date = '';
  public field_project_description = '';
  public password_reset_url = environment.backend + 'user/password';

  constructor(
    private route: ActivatedRoute,
    public authorizeService: authorizeService,
    private router: Router,
    private API: APIService,
    public globals: Globals,
  ) {
  }

  ngOnInit() {
    if (!this.authorizeService.isAuthenticated()) {
      // If not, redirect to the login page.
      this.router.navigate(['/authorize'], { queryParams: { 'destination': 'corpus' } });
    }
    this.API.getUser().subscribe(response => {
      if (response.name) {
        this.full_name = response.full_name;
        this.mail = response.email;
        this.name = response.name;
        this.roles = response.roles;
        this.created = response.created;
        this.field_project_complete_date = response.field_project_complete_date;
        this.field_project_description = response.field_project_description;
        this.password_reset_url += '?name=' + response.email;
      }
    });
  }

}
