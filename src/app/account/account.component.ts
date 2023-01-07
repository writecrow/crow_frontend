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
      if (response[0]) {
        this.full_name = response[0].full_name;
        this.mail = response[0].email;
        this.name = response[0].name;
        this.roles = response[0].roles.split(',');
        this.created = response[0].created;
        this.field_project_complete_date = response[0].field_project_complete_date;
        this.field_project_description = response[0].field_project_description;
        this.password_reset_url += '?name=' + response[0].email;
      }
    });
  }

}
