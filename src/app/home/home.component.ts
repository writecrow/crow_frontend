import { Component } from '@angular/core';
import { APIService } from '../services/api.service';

@Component({
  templateUrl: '../home/home.component.html',
  styleUrls: ['../home/home.component.css']
})

export class HomeComponent {

  constructor(
    private API: APIService,
  ) { }

  ngOnInit(): void {
    this.API.getTotalWords().subscribe((response) => {
      if (typeof response !== 'undefined' && response != '') {
        console.log(response);
      }
    });
  }
}

