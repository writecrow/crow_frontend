import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
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
  statusMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
    public globals: Globals,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.globals.inProgress = true;
      this.drafts = [];
      this.exactResources = [];
      // Pass 2 parameters to API: the route path, and any query parameters.
      this.API.getCorpusDetailById(routeParams.id, this.route.snapshot.queryParams).subscribe(response => {
        if (response && response[0]) {
          this.content = this.prepareDisplayOutput(response[0]);
          this.isLoaded = true;
          // Retrieve all drafts for this ID, institution, & assignment.
          const draftParameters = {
            'id' : this.content.id,
            'assignment' : this.content.assignment,
            'institution' : this.content.institution,
          };
          // Retrieve all texts with same ID (i.e., drafts).
          this.API.getCorpusReferenceByMetadata(draftParameters).subscribe(response => {
            if (response && response !== '') {
              for (const i of Object.keys(response)) {
                const element = {};
                const draftno = response[i].draft;
                this.drafts.push({ draft: draftno, data: response[i] });
              }
              this.drafts = this.sortByKey(this.drafts, "draft");
            }
          });
          const relatedTexts = {
            'course': this.content.course,
            'assignment': this.content.assignment,
            'institution': this.content.institution,
            'instructor': this.content.instructor,
            'exclude_id': this.content.filename,
          };
          // Retrieve all texts with similar metadata
          this.API.getCorpusReferenceByMetadata(relatedTexts).subscribe(response => {
            if (response && response !== '') {
              this.relatedTexts = response;
            }
          });
          // Retrieve repository resources that have matching metadata.
          const repositoryParameters = {
            'course': this.content.course,
            'assignment': this.content.assignment,
            'institution': this.content.institution,
            'instructor': this.content.instructor,
            'year': this.content.year,
            'semester': this.content.semester,
          };
          this.API.getRepositoryReferenceByMetadata(repositoryParameters).subscribe(response => {
            this.globals.inProgress = false;
            if (response && response !== '') {
              this.exactResources = response;
            }
          });
        } else {
          this.router.navigateByUrl('404', { skipLocationChange: true });
        }
      },
      err => {
        // Handle 500s.
        this.isLoaded = true;
        this.globals.inProgress = false;
        this.statusMessage = 'There was a problem retrieving this resource. You can wait a moment, then try again. If the problem persists, please email the maintainers at <a href="mailto: collaborate@writecrow.org">collaborate@writecrow.org</a>, describing the search parameters you were using, and we will investigate.';
      });
    });
  }

  prepareDisplayOutput(data): CorpusDetail {
    if (data.gender === null || data.gender === "") {
      data.gender = "N/A";
    }
    if (data.program === null || data.program === "") {
      data.program = "N/A";
    }
    if (data.college === null || data.college === "") {
      data.college = "N/A";
    }
    return data;
  }

  // Used to sort drafts alphanumerically (final at end).
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      const x = a[key]; const y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  toggleFacet(i) {
    // Used to show/hide elements in an Angular way.
    // See https://stackoverflow.com/a/35163037
    if (this.globals.repositoryFacets[i] === undefined) {
      this.globals.repositoryFacets[i] = true;
    } else if (this.globals.repositoryFacets[i] === false) {
      this.globals.repositoryFacets[i] = true;
    } else {
      this.globals.repositoryFacets[i] = false;
    }
  }

}
