import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { CorpusDetail } from '../corpus/corpus-detail';
import { CourseDescriptionService } from '../services/courseDescription.service';
import { AssignmentDescriptionService } from '../services/assignmentDescription.service';
import { Globals } from '../globals';
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
  public validKeywordModes: any[] = ['and', 'or'];
  public method: string = 'word';
  public validMethods: any[] = ['word', 'lemma'];
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
    private sanitizer: DomSanitizer,
    private courses: CourseDescriptionService,
    private assignments: AssignmentDescriptionService,
    public globals: Globals,
  ) {

    // Additional filters.
    this.filters = <any>[];
    this.filters['searchByID'] = { backend_key: 'id', value: '' };
    this.filters['toeflTotalMin'] = { backend_key: 'toefl_total_min', value: '' };
    this.filters['toeflTotalMax'] = { backend_key: 'toefl_total_max', value: '' };

    // The order in which these are pushed into the "facets" object determine their order in the sidebar.
    this.facets = <any>[];
    this.facets['institution'] = { label: 'Institution', index: '6' };
    this.facets['year'] = { label: 'Year', index: '10' };
    this.facets['semester'] = { label: 'Semester', index: '9' };
    this.facets['course'] = { label: 'Course', index: '3' };
    this.facets['assignment'] = { label: 'Assignment', index: '0' };
    this.facets['draft'] = { label: 'Draft', index: '4' };
    this.facets['college'] = { label: 'College', index: '1' };
    this.facets['country'] = { label: 'Country', index: '2' };
    this.facets['gender'] = { label: 'Gender', index: '5' };
    this.facets['program'] = { label: 'Program', index: '8' };
    this.facets['year_in_school'] = { label: 'Year in School', index: '11' };
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
      else {
        currentParams[key] = null;
      }
    }
    if (terms != "") {
      currentParams.search = this.sanitizer.sanitize(SecurityContext.URL, terms);
    }
    else {
      currentParams.search = null;
    }
    if (this.keywordMode !== "undefined" && this.validKeywordModes.includes(this.keywordMode)) {
      currentParams.op = this.keywordMode;
    }
    if (typeof this.method !== "undefined" && this.validMethods.includes(this.method)) {
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
        let facetOutput = [];
        for (let key in facetKeys) {
          let id = facetKeys[key];
          let data = { 'name': facetKeys[key], 'count': facets[name][id].count, 'active': facets[name][id].active, 'description': '' };
          if (name == 'course') {
            data.description = this.courses.getDescription(facetKeys[key]);
          }
          if (name == 'assignment') {
            data.description = this.assignments.getDescription(facetKeys[key], "Purdue University");
          }
          facetOutput.push(data);
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
    this.isLoaded = false;
    this.route.queryParams.subscribe((routeParams) => {
      this.resultCount = 0;
      this.method = "word";
      this.keywordMode = "or";
      this.subcorpusWordcount = 0;
      this.searchInProgress = true;
      this.frequencyData = [];
      this.frequencyTotals = [];
      this.searchResults = [];
      // Populate the interface from the URL.
      // @todo -- move this to a callback function?
      if (typeof routeParams.search != 'undefined' && routeParams.search != "") {
        this.searchString = routeParams.search;
      }
      if (typeof routeParams.method != 'undefined' && this.validMethods.includes(routeParams.method)) {
        this.method = routeParams.method;
      }
      if (typeof routeParams.op != 'undefined' && this.validKeywordModes.includes(routeParams.op)) {
        this.keywordMode = routeParams.op;
      }
      if (typeof routeParams.id != 'undefined' && routeParams.id != "") {
        this.filters['searchByID'].value = routeParams.id;
      }
      if (typeof routeParams.toefl_total_min != 'undefined' && routeParams.toefl_total_min != "") {
        this.filters['toeflTotalMin'].value = routeParams.toefl_total_min;
      }
      if (typeof routeParams.toefl_total_max != 'undefined' && routeParams.toefl_total_max != "") {
        this.filters['toeflTotalMax'].value = routeParams.toefl_total_max;
      }
      let searchUrl = this.API.getCorpusSearchApiQuery(routeParams);
      this.API.searchCorpus(searchUrl).subscribe(response => {
        if (response && response.search_results) {
          this.isLoaded = true;
          this.searchResults = this.prepareSearchResults(response.search_results);
        }
        if (response && typeof response.facets !== 'undefined') {
          this.preparefacets(response.facets);
        }
        if (response && typeof response.frequency.tokens !== 'undefined') {
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
        // Determine how to display the export button.
        // Note: this does not actually authorize folks to
        // retrieve data via the export.
        this.API.getRoles().subscribe(response => {
          if (response) {
            if (response.includes('export_access')) {
              if (searchUrl == '') {
                searchUrl = '?';
              }
              this.exportUrl = searchUrl;
            }
          }
        });
      }, 
      err => {
        // Handle 500s.
        this.searchInProgress = false;
      });
    });

  }

  prepareSearchResults(results) {
    for (let r in results) {
      results[r]["course_description"] = this.courses.getDescription(results[r].course);
      results[r]["assignment_description"] = this.assignments.getDescription(results[r].assignment, "Purdue University");
    }
    return results;    
  }
  toggleFacet(i) {
    // Used to show/hide elements in an Angular way.
    // See https://stackoverflow.com/a/35163037
    if (this.globals.corpusFacets[i] === undefined) {
      console.log("heere");
      this.globals.corpusFacets[i] = true;
    }
    else if (this.globals.corpusFacets[i] === false) {
      this.globals.corpusFacets[i] = true;
    } else {
      this.globals.corpusFacets[i] = false;
    }
  }
  reset() {
    this.searchString = "";
    this.method = "word";
    this.filters['searchByID'].value = "";
    this.filters['toeflTotalMin'].value = "";
    this.filters['toeflTotalMax'].value = "";
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
  exportResults(exportUrl) {
    this.API.exportCorpus(exportUrl).subscribe(response => {
      if (response) {
        // Based on https://fullstacktips.blogspot.com/2018/06/generate-downloadable-csv-file-from.html
        let data = response;
        let filename = "crow-export.csv";

        var blob = data.constructor !== Blob
          ? new Blob([data], { type: 'text/csv' || 'application/octet-stream' })
          : data;

        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, filename);
          return;
        }

        var lnk = document.createElement('a'),
          url = window.URL,
          objectURL;
        lnk.type = 'text/csv';
        lnk.download = filename;
        lnk.href = objectURL = url.createObjectURL(blob);
        lnk.dispatchEvent(new MouseEvent('click'));
        setTimeout(url.revokeObjectURL.bind(url, objectURL));
        return;
      }
    });
  }
}