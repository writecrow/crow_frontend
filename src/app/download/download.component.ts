import { authorizeService } from '../services/authorize.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';

@Component({
  templateUrl: '../download/download.component.html',
  styleUrls: ['../download/download.component.css']
})

export class DownloadComponent implements OnInit {

  public href = "";
  public downloadUrl = false;
  public registration_url = environment.backend + 'user/register';

  constructor(
    private route: ActivatedRoute,
    public authorizeService: authorizeService,
    private router: Router,
    private API: APIService,
    public globals: Globals,
  ) {
  }

  ngOnInit() {
    this.globals.inProgress = false;
    this.href = this.router.url;
    this.API.getRoles().subscribe(response => {
      if (response) {
        if (response.includes('offline')) {
          this.downloadUrl = true;
        }
      }
    });
  }

  offlineDownload() {
    this.globals.inProgress = true;
    this.API.offlineCorpus().subscribe(response => {
      if (response) {
        // Based on https://fullstacktips.blogspot.com/2018/06/generate-downloadable-csv-file-from.html
        const data = response;
        const filename = "crow-offline-v1.zip";

        const blob = data.constructor !== Blob
          ? new Blob([data], { type: 'text/zip' || 'application/octet-stream' })
          : data;

        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, filename);
          return;
        }

        // eslint-disable-next-line prefer-const
        let lnk = document.createElement('a'),
          // eslint-disable-next-line prefer-const
          url = window.URL,
          objectURL;
        lnk.type = 'text/zip';
        lnk.download = filename;
        lnk.href = objectURL = url.createObjectURL(blob);
        lnk.dispatchEvent(new MouseEvent('click'));
        setTimeout(url.revokeObjectURL.bind(url, objectURL));
        this.globals.inProgress = false;
        return;
      }
    });
  }
}
