import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { APIService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { RepositoryDetail } from '../repository/repository-detail';
import { RepositoryHelper } from '../repository/repository-helper';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: '../repository/repository-detail.component.html',
  styleUrls: ['../repository/repository-detail.component.css']
})

export class RepositoryDetailComponent implements OnInit {
  content : RepositoryDetail;
  isLoaded : boolean;
  exactTexts: any[] = [];
  relatedTexts: any[] = [];
  relatedResources: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
    private sanitizer: DomSanitizer,
    private repositoryHelper: RepositoryHelper,
  ) { }

  ngOnInit(): void {
    combineLatest(this.route.params, this.route.queryParams)
      .pipe(map(routes => ({ params: routes[0], query: routes[1] })))
      .subscribe(routes => {
        let repositoryRequest = {
          'id': routes.params.id,
          'search': routes.query.search
        };
        this.API.getRepositoryReferenceByMetadata(repositoryRequest).subscribe(response => {
          if (response && response[0]) {
            this.content = response[0];
            this.content.label = this.repositoryHelper.getLabel(this.content.document_type, this.content.course, this.content.assignment);
            this.content.uri = environment.backend + this.content.file;
            this.content.embed_uri = this.sanitizer.bypassSecurityTrustResourceUrl("http://docs.google.com/gview?url=" + this.content.uri + "&embedded=true");
            this.isLoaded = true;
            let exactTexts = {
              'course': this.content.course,
              'assignment': this.content.assignment,
              'institution': this.content.institution,
              'instructor': this.content.instructor,
              'year': this.content.year,
            };
            if (this.content.assignment == '') {
              let relatedTexts = {
                'course': this.content.course,
                'institution': this.content.institution,
                'instructor': this.content.instructor,
                'semester': this.content.semester,
                'year': this.content.year,
              };
            }
            // Retrieve all texts with similar metadata
            this.API.getCorpusReferenceByMetadata(exactTexts).subscribe(response => {
              if (response && response != '') {
                this.exactTexts = response;
              }
            });
            let repositoryParameters = {
              'course': this.content.course,
              'assignment': this.content.assignment,
              'institution': this.content.institution,
              'instructor': this.content.instructor,
              'semester': this.content.semester,              
              'year': this.content.year,
            };
            this.API.getRepositoryReferenceByMetadata(repositoryParameters).subscribe(response => {
              if (response && response != '') {
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