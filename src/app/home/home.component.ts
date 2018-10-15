import { Component } from '@angular/core';
import { APIService } from '../services/api.service';

@Component({
  templateUrl: '../home/home.component.html',
  styleUrls: ['../home/home.component.css']
})

export class HomeComponent {
  total_words : number;
  total_texts : number;

  constructor(
    private API: APIService,
  ) { }

  ngOnInit(): void {
    this.total_words = 7287456;
    this.total_texts = 8253;
    this.API.getTotalWords().subscribe((frequency) => {
      if (typeof frequency !== 'undefined' && frequency) {
        this.total_words = frequency.total;
        // Pre-load the corpus search data, in part to get the total
        // number of text, and also for faster perceived loading when
        // users navigate to the corpus (results already cached).
        this.API.getDefaultCorpusSearch().subscribe((response) => {
          if (typeof response !== 'undefined' && response) {
            this.total_texts = response.pager.total_items;
          }
        });
      }
    });
  }
}

