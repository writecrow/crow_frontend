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
  frequencyData: any[] = [];
  resultCount: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
  ) {
    var authenticated = localStorage.getItem('crowAuthenticate');
    if (authenticated != 'yes') {
      this.router.navigate(['/authorize']);
    }
    // The order in which these are pushed into the "Facets" object determine their order in the sidebar.
    this.Facets = <any>[];
    this.Facets['institution'] = { label: 'Institution', show: true, index: '6' };
    this.Facets['year'] = { label: 'Year', show: false, index: '10' };
    this.Facets['semester'] = { label: 'Semester', show: false, index: '9' };
    this.Facets['course'] = { label: 'Course', show: false, index: '3' };
    this.Facets['assignment'] = { label: 'Assignment', show: false, index: '0' };
    this.Facets['draft'] = { label: 'Draft', show: false, index: '4' };

    this.Facets['college'] = { label: 'College', show: false, index: '1' };
    this.Facets['country'] = { label: 'Country', show: false, index: '2' };
    this.Facets['gender'] = { label: 'Gender', show: false, index: '5' };
    // this.Facets['instructor'] = { label: 'Instructor', show: true, index: '7' };
    this.Facets['program'] = { label: 'Program', show: false, index: '8' };
    this.Facets['year_in_school'] = { label: 'Year in School', show: false, index: '11' };
    this.querySearch();
  }

  textSearch(terms: string): void {
    this.searchInProgress = true;
    // Called on click of search button.
    // Merges user-supplied search term into existing URL and calls querySearch().
    this.router.navigate(['/corpus'], { queryParams: { search: terms }, queryParamsHandling: 'merge' });
  }

  facetSearch(facetgroup, facet, active) {
    this.searchInProgress = true;
    // First, retrieve the current facetgroup & split its choices into an array.
    let selections = [];
    if (typeof this.route.snapshot.queryParams[facetgroup] !== 'undefined') {
      const selected = this.route.snapshot.queryParams[facetgroup];
      selections = selected.split(',');
    }

    if (typeof active === 'undefined') {
      // The clicked facet was not selected.
      // Append it to the list of selected items for the given facetgroup.
      if (typeof selections[facet] === 'undefined') {
        selections.push(facet);
      }
    }
    else {
      // The clicked facet had been selected.
      // Remove it from the list of selected items for the given facetgroup.
      for (const i in selections) {
        if (selections[i] === facet) {
          selections.splice(+i, 1);
        }
      }
    }
    let facetString = selections.join(',');
    if (facetString === '') {
      facetString = null;
    }

    this.router.navigate(['/corpus'], { queryParams: { [facetgroup]: facetString }, queryParamsHandling: 'merge' });
  }

  prepareFacets(facets) {
    this.FacetKeys = Object.keys(this.Facets);
    // Loop through each of the defined facets for this repository and assign
    // values returned from the API to their object.
    for (let name in this.Facets) {
      let i = this.Facets[name].index;
      if (typeof facets[i][0] !== 'undefined') {
        this.Facets[name].values = facets[i][0][name];
      }
      else {
        this.Facets[name].values = [];
      }
    }
  }

  querySearch() {
    // The main search function. Looks for the current URL parameters & sends those to the backend.
    this.searchInProgress = true;
    this.resultCount = 0;
    this.route.queryParams.subscribe((routeParams) => {
      if (routeParams.search != 'undefined') {
        // Set the text input to the query provided in the URL.
        this.searchString = routeParams.search;
      }
      this.API.getFrequencyData(this.searchString).subscribe(response => {
        if (response && response.tokens) {
          this.frequencyData = response.tokens;
        }
        else {
          this.frequencyData = [];
        }
      });
      this.API.searchCorpus(routeParams).subscribe(response => {
        if (response && response.search_results) {
          this.searchResults = response.search_results;
          this.isLoaded = true;
          // Do additional modifications on the returned API data.
        }
        else {
          this.searchResults = [];
        }
        if (response && response.facets) {
          this.prepareFacets(response.facets);
        }
        this.resultCount = response.pager['total_items'];
        this.searchInProgress = false;
      });
    });
  }

  toggleFacet(i) {
    // Used to show/hide elements in an Angular way.
    // See https://stackoverflow.com/a/35163037
    if (this.Facets[i].show === false) {
      this.Facets[i].show = true;
    } else {
      this.Facets[i].show = false;
    }
  }

  reset() {
    this.router.navigate(['/corpus']);
  }

}