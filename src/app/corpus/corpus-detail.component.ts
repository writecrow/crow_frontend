import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { AssignmentDescriptionService } from '../services/assignmentDescription.service';
import { CourseDescriptionService } from '../services/courseDescription.service';
import { CorpusDetail } from '../corpus/corpus-detail';

@Component({
  templateUrl: '../corpus/corpus-detail.component.html',
  styleUrls: ['../corpus/corpus-detail.component.css']
})

export class CorpusDetailComponent implements OnInit {
  content: CorpusDetail;
  drafts: any[] = [];
  repositoryResources: any[] = [];
  isLoaded: boolean;
  statusMessage: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
    private assignments: AssignmentDescriptionService,
    private courses: CourseDescriptionService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.drafts = [];
      this.repositoryResources = [];
      // Pass 2 parameters to API: the route path, and any query parameters.
      this.API.getCorpusDetailById(routeParams.id, this.route.snapshot.queryParams).subscribe(response => {
        if (response && response[0]) {
          this.content = response[0];
          // Add assignment description.
          this.content.assignment_description = this.assignments.getDescription(this.content.assignment, this.content.institution);
          this.content.course_description = this.courses.getDescription(this.content.course);
          this.isLoaded = true;
          // Retrieve all drafts for this ID, institution, & assignment.
          let draftParameters = {
            'id' : this.content.id,
            'assignment' : this.content.assignment,
            'institution' : this.content.institution
          };
          // Retrieve all texts with same ID (i.e., drafts).
          this.API.getCorpusReferenceByMetadata(draftParameters).subscribe(response => {
            if (response && response != '') {
              for (const i of Object.keys(response)) {
                const element = {};
                let draftno = response[i].draft;
                this.drafts.push({ draft: draftno, data: response[i] });
              }
              this.drafts = this.sortByKey(this.drafts, "draft");
            }
          });
          // Retrieve any repository resources that have matching metadata.
          // @todo: narrow the criteria when we have more materials.
          let repositoryParameters = { 
            'course': this.content.course,
            'assignment': this.content.assignment,
            'institution': this.content.institution
          };
          this.API.getRepositoryReferenceByMetadata(repositoryParameters).subscribe(response => {
            if (response && response != '') {
              this.repositoryResources = response;
            }
          });  
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

}