import { Component } from '@angular/core';
import { APIService } from '../services/api.service';

@Component({
  templateUrl: '../corpus/search.component.html',
  styleUrls: ['../corpus/search.component.css']
})

export class CorpusSearchComponent {

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