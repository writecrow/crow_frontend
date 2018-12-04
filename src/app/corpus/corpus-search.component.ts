import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { CorpusDetail } from '../corpus/corpus-detail';

@Component({
  templateUrl: '../corpus/corpus-search.component.html',
  styleUrls: ['../corpus/corpus-search.component.css']
})

export class CorpusSearchComponent {
  searchResults: CorpusDetail[];
  Facets: any[] = [];
  FacetKeys: any[] = [];
  isLoaded: boolean;
  searchInProgress: boolean;
  searchString: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
  ) {
    // The order in which these are pushed into the "Facets" object determine their order in the sidebar.
    this.querySearch();
  }

  querySearch() {
    // The main search function. Looks for the current URL parameters & sends those to the backend.
    this.searchInProgress = true;
    this.route.queryParams.subscribe((routeParams) => {
      if (routeParams.search != 'undefined') {
        // Set the text input to the query provided in the URL.
        this.searchString = routeParams.search;
      }
      this.API.searchCorpus(routeParams).subscribe(response => {
        if (response && response.search_results) {
          this.searchResults = response.search_results;
          this.isLoaded = true;
          console.log(this.searchResults);
          // Do additional modifications on the returned API data.
        }
        if (response && response.facets) {
        }
        this.searchInProgress = false;
      });
    });
  }
}