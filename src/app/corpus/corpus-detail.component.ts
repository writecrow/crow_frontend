import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../services/api.service';
import { CorpusDetail } from '../corpus/corpus-detail';

@Component({
  templateUrl: '../corpus/corpus-detail.component.html',
  styleUrls: ['../corpus/corpus-detail.component.css']
})

export class CorpusDetailComponent implements OnInit {
  content: CorpusDetail;
  drafts: CorpusDetail;
  isLoaded: boolean;

  constructor(
    private route: ActivatedRoute,
    private API: APIService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      // Pass 2 parameters to API: the route path, and any query parameters.
      this.API.getCorpusDetail(routeParams.id, this.route.snapshot.queryParams).subscribe(response => {
        if (response && response[0]) {
          this.content = response[0];
          this.isLoaded = true;
          // Retrieve all drafts for this ID, institution, & assignment.
          let draftParameters = {'id' : this.content.id, 'assignment' : this.content.assignment, 'institution' : this.content.institution}
          // Retrieve all texts with same ID.
          this.API.getCorpusDetailByAttributes(draftParameters).subscribe(response => {
            if (response && response != '') {
              console.log(response);
              //for (const i of Object.keys(response)) {
              //  const element = {};
              //  let draftno = response[i].draft;
              //  this.Drafts.push({ draft: draftno, data: response[i] });
              //}
              //this.Drafts = this.sortByKey(this.Drafts, "draft");
            }
          }); 
        }
      });
    });
  }

}