import { authorizeService } from '../services/authorize.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';

@Component({
  templateUrl: '../download/download.component.html',
  styleUrls: ['../download/download.component.css']
})

export class DownloadComponent implements OnInit {

  public href = "";
  public downloadUrl = false;

  constructor(
    private route: ActivatedRoute,
    public authorizeService: authorizeService,
    private router: Router,
    private API: APIService,
  ) {
  }

  ngOnInit() {
    this.href = this.router.url;
    this.API.getRoles().subscribe(response => {
      if (response) {
        if (response.includes('offline_access')) {
          this.downloadUrl = true;
        }
      }
    });
  }
}
