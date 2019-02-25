import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authorizeService } from '../authorize/authorize.service';
import { LoginService} from '../services/login.service';
import { AppComponent } from '../app.component';
import { Globals } from '../globals';
@Component({
  templateUrl: '../authorize/authorize.component.html',
  styleUrls: ['../authorize/authorize.component.css'],
  providers: [authorizeService],
})

export class AuthorizeComponent {

  public statusMessage: string = '';
  private text: string;

  constructor(
    private router: Router,
    public authorizeService: authorizeService,
    public LoginService: LoginService,
    public app: AppComponent,
    private globals: Globals,
  ) { }

  ngOnInit(): void {
    this.statusMessage = '';
  }

  authorize(name: string, pass: string, additional: string): void {
    name = name.trim();
    console.log(additional);
    if (!name || additional !== "" ) { return; }
    let user: any = { name, pass };
    this.LoginService.login(user.name, user.pass).subscribe(
      data => {
        this.globals.isAuthenticated = true;
        this.router.navigate(['/']); 
      },
      error => this.statusMessage = error
    );
  }
}