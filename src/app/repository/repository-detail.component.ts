import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { APIService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { RepositoryDetail } from '../repository/repository-detail';
import { RepositoryHelper } from '../repository/repository-helper';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Globals } from '../globals';

@Component({
  templateUrl: '../repository/repository-detail.component.html',
  styleUrls: ['../repository/repository-detail.component.css']
})

export class RepositoryDetailComponent implements OnInit {
  content: RepositoryDetail;
  isLoaded: boolean;
  exactTexts: any[] = [];
  relatedTexts: any[] = [];
  exactResources: any[] = [];
  relatedResources: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
    public globals: Globals,
    private sanitizer: DomSanitizer,
    private repositoryHelper: RepositoryHelper,
  ) { }

  ngOnInit(): void {
    this.globals.inProgress = true;
    combineLatest([this.route.params, this.route.queryParams])
      .pipe(map(routes => ({ params: routes[0], query: routes[1] })))
      .subscribe(routes => {
        const repositoryRequest = {
          'id': routes.params.id,
          'search': routes.query.search
        };
        this.API.getRepositoryReferenceByMetadata(repositoryRequest).subscribe(response => {
          if (response && response[0]) {
            this.content = response[0];
            this.content.label = this.repositoryHelper.getLabel(
              this.content.document_type,
              this.content.course,
              this.content.assignment,
              this.content.topic
            );
            this.content.uri = environment.backend + this.content.file;
            this.content.embed_uri = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url=" + this.content.uri + "&embedded=true");
            this.isLoaded = true;
            if (this.content.assignment !== '') {
              const exactTexts = {
                'course': this.content.course,
                'assignment': this.content.assignment,
                'institution': this.content.institution,
                'instructor': this.content.instructor,
                'semester': this.content.semester,
                'year': this.content.year,
              };
              // Retrieve all texts with similar metadata
              this.API.getCorpusReferenceByMetadata(exactTexts).subscribe(response => {
                if (response && response !== '') {
                  this.exactTexts = response;
                }
              });
              const relatedTexts = {
                'course': this.content.course,
                'assignment': this.content.assignment,
                'institution': this.content.institution,
                'instructor': this.content.instructor,
              };
              // Retrieve all texts with similar metadata
              this.API.getCorpusReferenceByMetadata(relatedTexts).subscribe(response => {
                if (response && response !== '') {
                  this.relatedTexts = response;
                }
              });
            }

            const repositoryParameters = {
              'course': this.content.course,
              'assignment': this.content.assignment,
              'institution': this.content.institution,
              'instructor': this.content.instructor,
              'semester': this.content.semester,
              'year': this.content.year,
              'exclude_id': this.content.id,
            };
            this.API.getRepositoryReferenceByMetadata(repositoryParameters).subscribe(response => {
              if (response && response !== '') {
                this.exactResources = response;
              }
            });
            const relatedRepositoryParameters = {
              'course': this.content.course,
              'assignment': this.content.assignment,
              'institution': this.content.institution,
              'exclude_id': this.content.id,
            };
            this.API.getRepositoryReferenceByMetadata(relatedRepositoryParameters).subscribe(response => {
              this.globals.inProgress = false;
              if (response && response !== '') {
                this.relatedResources = response;
              }
            });
          } else {
            this.router.navigateByUrl('404', { skipLocationChange: true });
          }
        });
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
