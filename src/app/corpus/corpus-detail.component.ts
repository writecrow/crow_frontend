import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { AssignmentDescriptionService } from '../services/assignmentDescription.service';
import { CourseDescriptionService } from '../services/courseDescription.service';
import { CorpusDetail } from '../corpus/corpus-detail';
import { Globals } from '../globals';
@Component({
  templateUrl: '../corpus/corpus-detail.component.html',
  styleUrls: ['../corpus/corpus-detail.component.css']
})

export class CorpusDetailComponent implements OnInit {
  content: CorpusDetail;
  drafts: any[] = [];
  exactResources: any[] = [];
  relatedRepositoryResources: any[] = [];
  relatedTexts: any[] = [];
  isLoaded: boolean;
  statusMessage: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
    private assignments: AssignmentDescriptionService,
    private courses: CourseDescriptionService,
    public globals: Globals,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.drafts = [];
      this.exactResources = [];
      // Pass 2 parameters to API: the route path, and any query parameters.
      this.API.getCorpusDetailById(routeParams.id, this.route.snapshot.queryParams).subscribe(response => {
        if (response && response[0]) {
          this.content = response[0];
          this.isLoaded = true;
        }
        else {
          this.router.navigateByUrl('404', { skipLocationChange: true });
        }
      },
      err => {
        // Handle 500s.
        this.isLoaded = true;
        this.statusMessage = 'There was a problem retrieving this resource. You can wait a moment, then try again. If the problem persists, please email the maintainers at <a href="mailto: collaborate@writecrow.org">collaborate@writecrow.org</a>, describing the search parameters you were using, and we will investigate.';
      });
    });
  }

  // Used to sort drafts alphanumerically (final at end).
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
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

}