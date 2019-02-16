import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { CorpusDetail } from '../corpus/corpus-detail';
import { environment } from '../../environments/environment';

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
  subcorpusWordcount: number;
  filters: any[] = [];

  // Used for constructing the search
  public keywordMode: string = 'or';
  public method: string = 'word';
  public searchString: string = "";
  public exportUrl: string = "";

  // Display toggles.
  advancedSearch: boolean = false;
  isLoaded: boolean = false;
  searchInProgress: boolean = false;;
  toeflShow: boolean = false;
  showMetadata: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
  ) {
    var authenticated = localStorage.getItem('crowAuthenticate');
    if (authenticated != 'yes') {
      this.router.navigate(['/authorize']);
    }

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
    // Called on click of search button.
    // Merge user-supplied search parameters into existing URL & call querySearch().
    let currentParams = <any>[];
    // Evaluate additional filters (search by ID, TOEFL scores).
    for (let filter in this.filters) {
      let key = this.filters[filter].backend_key;
      if (this.filters[filter].value !== "") {
        currentParams[key] = this.filters[filter].value;
      }
    }
    if (terms != "") {
      currentParams.search = terms;
    }
    if (this.keywordMode != "or") {
      currentParams.op = this.keywordMode;
    }
    if (typeof this.method !== "undefined") {
      currentParams.method = this.method;
    }
    this.router.navigate(['/corpus'], { queryParams: currentParams, queryParamsHandling: 'merge' });
  }

  facetSearch(facetgroup, facet, active) {
    // First, retrieve the current facetgroup & split its choices into an array.
    let selections = [];
    if (typeof this.route.snapshot.queryParams[facetgroup] !== 'undefined') {
      const selected = this.route.snapshot.queryParams[facetgroup];
      selections = selected.split('+');
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
    let facetString = selections.join('+');
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
      if (typeof facets[name] !== 'undefined') {
        let facetKeys = Object.keys(facets[name]);
        let facetValues = Object.values(facets[name]);
        let facetOutput = [];
        for (let key in facetKeys) {
          let id = facetKeys[key];
          facetOutput.push({ 'name': facetKeys[key], 'count': facets[name][id].count, 'active': facets[name][id].active});
        }
        this.facets[name].values = facetOutput;
      }
      else {
        this.facets[name].values = [];
      }
    }
  }
  querySearch() {
    // The main search function. Looks for the current URL parameters & sends those to the backend.
    this.route.queryParams.subscribe((routeParams) => {
      this.resultCount = 0;
      this.subcorpusWordcount = 0;
      this.searchInProgress = true;
      this.frequencyData = [];
      this.frequencyTotals = [];
      this.searchResults = [];
      if (typeof routeParams.search != 'undefined' && routeParams.search != "") {
        // Set the text input to the query provided in the URL.
        this.searchString = routeParams.search;
      }
      let searchUrl = this.API.getCorpusSearchApiUrl(routeParams);
      this.exportUrl = environment.backend + searchUrl + "&_format=csv";
      this.API.searchCorpus(searchUrl).subscribe(response => {
        if (response && response.search_results) {
          this.searchResults = response.search_results;
          this.isLoaded = true;
          // Do additional modifications on the returned API data.
        }
        if (response && response.facets) {
          this.preparefacets(response.facets);
        }
        if (response && response.frequency) {
          let tokenKeys = Object.keys(response.frequency.tokens);
          let tokenValues = Object.values(response.frequency.tokens);
          for (let key in tokenKeys) {
            let id = tokenKeys[key];
            this.frequencyData.push({ 
              'token': id,
              'raw': tokenValues[key]["raw"],
              'normed': tokenValues[key]["normed"],
              'texts': tokenValues[key]["texts"],
            });
          }
          if (typeof response.frequency.totals != undefined) {
            this.frequencyTotals = response.frequency.totals;
          }
        }
        this.resultCount = response.pager['total_items'];
        this.subcorpusWordcount = response.pager['subcorpus_wordcount'];
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
    this.searchString = "";
    this.method = "word";
    this.filters['searchByID'].value = "";
    this.filters['toeflTotalMin'].value = "";
    this.filters['toeflTotalMax'].value = "";
    this.router.navigate(['/corpus']);
    this.exportUrl = "";
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