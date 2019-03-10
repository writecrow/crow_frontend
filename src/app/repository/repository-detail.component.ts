import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { RepositoryDetail } from '../repository/repository-detail';

@Component({
  templateUrl: '../repository/repository-detail.component.html',
  styleUrls: ['../repository/repository-detail.component.css']
})

export class RepositoryDetailComponent implements OnInit {
  content : RepositoryDetail;
  isLoaded : boolean;
  relatedTexts: any[] = [];
  relatedResources: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.API.getRepositoryDetailById(routeParams.id).subscribe(response => {
        if (response && response[0]) {
          this.content = response[0];
          this.isLoaded = true;
          let relatedTexts = {
            'course': this.content.course,
            'assignment': this.content.assignment,
            'institution': this.content.institution
          };
          if (this.content.assignment == '') {
            let relatedTexts = {
              'course': this.content.course,
              'year': this.content.year,
              'semester': this.content.semester,
              'institution': this.content.institution
            };
          }
          // Retrieve all texts with similar metadata
          this.API.getCorpusReferenceByMetadata(relatedTexts).subscribe(response => {
            if (response && response != '') {
              this.relatedTexts = response;
            }
          });
          let repositoryParameters = {
            'course': this.content.course,
            'assignment': this.content.assignment,
            'institution': this.content.institution
          };
          this.API.getRepositoryReferenceByMetadata(repositoryParameters).subscribe(response => {
            if (response && response != '') {
              console.log(response);
              this.relatedResources = response;
            }
          }); 
        }
        else {
          this.router.navigateByUrl('404', { skipLocationChange: true });
        }
      });
    });
  }

}