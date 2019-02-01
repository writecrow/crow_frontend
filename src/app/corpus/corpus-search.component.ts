import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { CorpusDetail } from '../corpus/corpus-detail';

@Component({
  templateUrl: '../corpus/corpus-search.component.html',
  styleUrls: ['../corpus/corpus-search.component.css']
})

export class CorpusSearchComponent {
  // Data containers.
  facets: any[] = [];
  facetKeys: any[] = [];
  frequencyData: any[] = [];
  frequencyTotals: any[] = [];
  searchResults: CorpusDetail[];
  resultCount: number;
  filters: any[] = [];

  // Used for constructing the search
  public keywordMode = 'or';
  public method = 'word';
  searchString: string;

  // Display toggles.
  advancedSearch: boolean;
  isLoaded: boolean;
  searchInProgress: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
  ) {
    var authenticated = localStorage.getItem('crowAuthenticate');
    if (authenticated != 'yes') {
      this.router.navigate(['/authorize']);
    }

    // Set startup defaults.
    this.advancedSearch = false;
    // Additional filters.
    this.filters = <any>[];
    this.filters['searchByID'] = { backend_key: 'id', value: '' };
    this.filters['toeflTotalMin'] = { backend_key: 'toefl_total[min]', value: '' };
    this.filters['toeflTotalMax'] = { backend_key: 'toefl_total[max]', value: '' };

    // The order in which these are pushed into the "facets" object determine their order in the sidebar.
    this.facets = <any>[];
    this.facets['institution'] = { label: 'Institution', show: true, index: '6' };
    this.facets['year'] = { label: 'Year', show: false, index: '10' };
    this.facets['semester'] = { label: 'Semester', show: false, index: '9' };
    this.facets['course'] = { label: 'Course', show: false, index: '3' };
    this.facets['assignment'] = { label: 'Assignment', show: false, index: '0' };
    this.facets['draft'] = { label: 'Draft', show: false, index: '4' };

    this.facets['college'] = { label: 'College', show: false, index: '1' };
    this.facets['country'] = { label: 'Country', show: false, index: '2' };
    this.facets['gender'] = { label: 'Gender', show: false, index: '5' };
    // this.facets['instructor'] = { label: 'Instructor', show: true, index: '7' };
    this.facets['program'] = { label: 'Program', show: false, index: '8' };
    this.facets['year_in_school'] = { label: 'Year in School', show: false, index: '11' };
    this.querySearch();
  }

  textSearch(terms: string): void {
    this.searchInProgress = true;
    // Called on click of search button.
    // Merges user-supplied search term into existing URL and calls querySearch().
    this.router.navigate(['/corpus'], { queryParams: { search: terms, op: this.keywordMode }, queryParamsHandling: 'merge' });
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

  preparefacets(facets) {
    this.facetKeys = Object.keys(this.facets);
    // Loop through each of the defined facets for this repository and assign
    // values returned from the API to their object.
    for (let name in this.facets) {
      let i = this.facets[name].index;
      if (typeof facets[i][0] !== 'undefined') {
        this.facets[name].values = facets[i][0][name];
      }
      else {
        this.facets[name].values = [];
      }
    }
  }

  querySearch() {
    // The main search function. Looks for the current URL parameters & sends those to the backend.
    this.searchInProgress = true;
    this.resultCount = 0;
    this.route.queryParams.subscribe((routeParams) => {
      if (typeof routeParams.search != 'undefined') {
        // Set the text input to the query provided in the URL.
        this.searchString = routeParams.search;
        this.API.getFrequencyData(routeParams).subscribe(response => {
          if (response && response.tokens) {
            this.frequencyData = response.tokens;
          }
          else {
            this.frequencyData = [];
          }
          if (response && response.totals) {
            console.log(response.totals);
            this.frequencyTotals = response.totals;
          }
          else {
            this.frequencyTotals = [];
          }
        });
      }
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
          this.preparefacets(response.facets);
        }
        this.resultCount = response.pager['total_items'];
        this.searchInProgress = false;
      });
    });
  }

  toggleFacet(i) {
    // Used to show/hide elements in an Angular way.
    // See https://stackoverflow.com/a/35163037
    if (this.facets[i].show === false) {
      this.facets[i].show = true;
    } else {
      this.facets[i].show = false;
    }
  }

  reset() {
    this.router.navigate(['/corpus']);
  }

  setOperation(i) {
    this.keywordMode = i;
  }
  setMethod(i) {
    this.method = i;
  }
  toggle(i) {
    // Used to show/hide visualizations in an Angular way.
    // See https://stackoverflow.com/a/35163037
    if (this[i] === false) {
      this[i] = true;
    } else {
      this[i] = false;
    }
  }
  evaluateToggle(i) {
    return this[i];
  }

}