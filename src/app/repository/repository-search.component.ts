import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { RepositoryDetail } from '../repository/repository-detail';

@Component({
  templateUrl: '../repository/repository-search.component.html',
  styleUrls: ['../repository/repository-search.component.css']
})

export class RepositorySearchComponent implements OnInit {
  searchResults: RepositoryDetail[];
  isLoaded: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.API.searchRepository(routeParams.id).subscribe(response => {
        if (response && response.search_results) {
          this.searchResults = response.search_results;
          this.isLoaded = true;
        }
        else {
          this.router.navigateByUrl('404', { skipLocationChange: true });
        }
      });
    });
  }
}