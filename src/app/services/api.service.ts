import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// See v6 implementation of Observables: https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#howto-convert-to-pipe-syntax
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { map } from 'rxjs/operators';

// Defines the REST endpoint URL per environment.
import { environment } from '../../environments/environment';

@Injectable()
export class APIService {

  constructor(private http: HttpClient) { }

  observable;

  getDefaultCorpusSearch() {
    return this.getResponseFromPath('texts/word?&_format=json');
  }

  getRepositoryDetail(id) {
    return this.getResponseFromPath('resources?id=' + id + '&_format=json');
  }

  getPage(path) {
    return this.getResponseFromPath('pages?path=' + path + '&_format=json');
  }

  getTotalWords() {
    return this.getResponseFromPath('frequency/total');
  }

  getResponseFromPath(path) {
    if (this.observable) {
      return this.observable;
    } else {
      this.observable = this.http.get(environment.backend + path, {
        observe: 'response'
      })
        .pipe(map(response => {
          this.observable = null;
          if (response.status === 200) {
            return response.body;
          }
          else {
            console.log(response.status + 'response from' + path);
            return false;
          }
        })
        ).pipe(share());
      return this.observable;
    }
  }

}