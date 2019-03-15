import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { RepositoryDetail } from '../repository/repository-detail';
import { Globals } from '../globals';

@Component({
  templateUrl: '../repository/repository-search.component.html',
  styleUrls: ['../repository/repository-search.component.css']
})

export class RepositorySearchComponent {
  searchResults: RepositoryDetail[];
  Facets: any[] = [];
  FacetKeys: any[] = [];
  isLoaded: boolean;
  searchInProgress: boolean;
  searchString: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
    public globals: Globals,
  ) {
    // The order in which these are pushed into the "Facets" object determine their order in the sidebar.
    this.Facets = <any>[];
    this.Facets['document_type'] = { label: 'Type', index: '3' };
    this.Facets['assignment'] = { label: 'Assignment', index: '0' };
    this.Facets['institution'] = { label: 'Institution', index: '5' };
    this.Facets['year'] = { label: 'Year', index: '9' };
    this.Facets['semester'] = { label: 'Semester', index: '8' };
    this.Facets['course'] = { label: 'Course', index: '1' };
    this.Facets['mode'] = { label: 'Mode', index: '7' };
    this.Facets['course_length'] = { label: 'Length', index: '2' };
    this.Facets['file_type'] = { label: 'File Type', index: '4' };
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
      this.API.searchRepository(routeParams).subscribe(response => {
        if (response && response.search_results) {
          this.searchResults = response.search_results;
          this.isLoaded = true;
          // Do additional modifications on the returned API data.
          this.adjustLabels(this.searchResults);
        }
        else {
        }
        if (response && response.facets) {
          this.prepareFacets(response.facets);
        }
        this.searchInProgress = false;
      });
    });
  }

  textSearch(terms: string): void {
    this.searchInProgress = true;
    // Called on click of search button.
    // Merges user-supplied search term into existing URL and calls querySearch().
    this.router.navigate(['/repository'], { queryParams: { search: terms }, queryParamsHandling: 'merge' });
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

    this.router.navigate(['/repository'], { queryParams: { [facetgroup]: facetString }, queryParamsHandling: 'merge' });
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

  adjustLabels(searchResults) {
    // Append additional information to title for clarity.
    for (let i in searchResults) {
      if (searchResults[i].document_type == 'Syllabus') {
        this.searchResults[i].document_type = this.searchResults[i].document_type.concat(': ' + searchResults[i].course);
      }
      if (['Assignment Sheet', 'Checklist', 'Peer Review Form', 'Rubric', 'Sample Work'].includes(searchResults[i].document_type)) {
        this.searchResults[i].document_type = this.searchResults[i].document_type.concat(': ' + searchResults[i].assignment);
      }
      if (searchResults[i].document_type == 'Handout') {
        if (searchResults[i].assignment != '') {
          this.searchResults[i].document_type = this.searchResults[i].document_type.concat(': ' + searchResults[i].assignment);
        }
        else if (searchResults[i].course != '') {
          this.searchResults[i].document_type = this.searchResults[i].document_type.concat(': ' + searchResults[i].course);
        }  
      }
    }
  }

  toggleFacet(i) {
    // Used to show/hide elements in an Angular way.
    // See https://stackoverflow.com/a/35163037
    if (this.globals.repositoryFacets[i] === undefined) {
      this.globals.repositoryFacets[i] = true;
    }
    else if (this.globals.repositoryFacets[i] === false) {
      this.globals.repositoryFacets[i] = true;
    } else {
      this.globals.repositoryFacets[i] = false;
    }
  }

  reset() {
    this.router.navigate(['/repository']);
  }
}