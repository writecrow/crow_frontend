import { Component } from '@angular/core';
import { APIService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: '../home/home.component.html',
  styleUrls: ['../home/home.component.css']
})

export class HomeComponent {
  total;

  constructor(
    private API: APIService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      this.API.getTotalWords().subscribe((response) => {
        if (typeof response !== 'undefined' && response != '') {
          this.total = response.total;
          console.log(response.total);
        }
      })
    ); 
  }
}

