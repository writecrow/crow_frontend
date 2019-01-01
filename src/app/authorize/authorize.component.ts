import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authorizeService } from '../authorize/authorize.service';

@Component({
  templateUrl: '../authorize/authorize.component.html',
  styleUrls: ['../authorize/authorize.component.css'],
  providers: [authorizeService],
})

export class AuthorizeComponent {

  public statusMessage: string = '';

  constructor(
    private router: Router,
    public authorizeService: authorizeService,
  ) { }

  ngOnInit(): void {
    this.statusMessage = '';
    var authenticated = localStorage.getItem('crowAuthenticate');
    if (authenticated == 'yes') {
      this.router.navigateByUrl('corpus');
    }
  }

  authorize(user: string, pass: string): void {
    var allowed = this.authorizeService.checkAuth(user, pass);
    if (allowed) {
      localStorage.setItem('crowAuthenticate', 'yes');
      this.router.navigateByUrl('corpus');
    }
    else {
      this.statusMessage = 'You entered an invalid passphrase.';
    }
  }

}