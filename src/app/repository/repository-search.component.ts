import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { RepositoryDetail } from '../repository/repository-detail';
import { RepositoryHelper } from '../repository/repository-helper';
import { assignmentDescriptionService } from '../services/description.service';
import { courseDescriptionService } from '../services/description.service';
import { typeDescriptionService } from '../services/description.service';
import { topicDescriptionService } from '../services/description.service';
import { Globals } from '../globals';

@Component({
  templateUrl: '../repository/repository-search.component.html',
  styleUrls: ['../repository/repository-search.component.css']
})

export class RepositorySearchComponent {
  searchResults: RepositoryDetail[];
  Facets: any[] = [];
  facetKeys: any[] = [];
  isLoaded: boolean;
  searchInProgress: boolean;
  searchString: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
    public globals: Globals,
    private repositoryHelper: RepositoryHelper,
    private courses: courseDescriptionService,
    private assignments: assignmentDescriptionService,
    private topics: topicDescriptionService,
    private types: typeDescriptionService,
  ) {
    // The order in which these are pushed into the "Facets" object determine their order in the sidebar.
    this.Facets = <any>[];
    this.Facets['document_type'] = { label: 'Type', index: '3' };
    this.Facets['topic'] = { label: 'Topic', index: '10' };
    this.Facets['assignment'] = { label: 'Assignment', index: '0' };
    this.Facets['institution'] = { label: 'Institution', index: '5' };
    this.Facets['year'] = { label: 'Year', index: '9' };
    this.Facets['semester'] = { label: 'Semester', index: '8' };
    this.Facets['course'] = { label: 'Course', index: '1' };
    this.Facets['mode'] = { label: 'Mode', index: '7' };
    this.Facets['course_length'] = { label: 'Length', index: '2' };
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
        if (response && response.facets) {
          this.Facets = this.prepareFacets(response.facets);
        }
        if (response && response.search_results) {
          this.searchResults = this.prepareSearchResults(response.search_results);
          this.isLoaded = true;
          // Do additional modifications on the returned API data.
          this.adjustLabels(this.searchResults);
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
    this.facetKeys = Object.keys(this.Facets);
    // Loop through each of the defined facets for this repository and assign
    // values returned from the API to their object.
    for (let name in this.Facets) {
      let i = this.Facets[name].index;
      let facetOutput = [];
      if (typeof facets[i][0] !== 'undefined') {
        for (let delta in facets[i][0][name]) {
          let values = facets[i][0][name][delta].values;
          let data = { 'name': values.value, 'count': values.count, 'active': values.active, 'description': '' };
          if (name == 'course') {
            data.description = this.courses.getDescription(values.value);
          }
          if (name == 'document_type') {
            data.description = this.types.getDescription(values.value);
          }
          if (name == 'topic') {
            data.description = this.topics.getDescription(values.value);
          }
          if (name == 'assignment') {
            data.description = this.assignments.getDescription(values.value, "Purdue  University");
          }
          facetOutput.push(data);
        }
        this.Facets[name].values = facetOutput;
      }
      else {
        this.Facets[name].values = [];
      }
    }
    return this.Facets;
  }

  adjustLabels(searchResults) {
    // Append additional information to title for clarity.
    for (let i in searchResults) {
      searchResults[i].label = this.repositoryHelper.getLabel(
        searchResults[i].document_type,
        searchResults[i].course,
        searchResults[i].assignment,
        searchResults[i].topic,
      );
    }
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