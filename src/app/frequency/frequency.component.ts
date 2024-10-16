import { authorizeService } from '../services/authorize.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { Globals } from '../globals';

@Component({
  templateUrl: '../frequency/frequency.component.html',
  styleUrls: ['../frequency/frequency.component.css']
})

export class FrequencyComponent {

  frequencyData: any[] = [];
  total_texts = '';
  total_words = '';
  category = '';
  name = '';
  results = 100;

  constructor(
    private route: ActivatedRoute,
    public authorizeService: authorizeService,
    private router: Router,
    private API: APIService,
    public globals: Globals,
  ) {
    // First check whether there is an authorization token present.
    if (!this.authorizeService.isAuthenticated()) {
      // If not, redirect to the login page.
      this.router.navigate(['/authorize'], { queryParams: { 'destination': 'corpus' } });
    }
    else {
      this.querySearch();
    }
  }

  prepareResults(response) {
    this.name = response.name;
    this.category = response.category;
    this.total_words = response.total_words;
    this.total_texts = response.total_texts;
    this.frequencyData = response.frequency;
    this.globals.inProgress = false;
  }

  querySearch() {
    this.route.queryParams.subscribe((routeParams) => {
      this.results = 100;
      if (routeParams.results !== null && (routeParams.results == 500 || routeParams.results == 1000)) {
        this.results = routeParams.results;
      }
      this.globals.inProgress = true;
      this.name = '';
      this.category = '';
      this.total_words = '';
      this.total_texts = '';
      this.frequencyData = [];

      this.API.getSubsetFrequency(routeParams).subscribe(response => {
        this.prepareResults(response);
      },
        err => {
          // Handle 500s.
          this.globals.inProgress = false;
        });
    });
  }

}
