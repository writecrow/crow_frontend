import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share } from 'rxjs/operators';
import { map } from 'rxjs/operators';

// Defines the REST endpoint URL per environment.
import { environment } from '../../environments/environment';

@Injectable()
export class APIService {

  constructor(private http: HttpClient) { }

  observable;

  getCorpusDetail(filename, queryParams) {
    const queryElements = [];
    queryElements.push('filename=' + filename);
    // Determine whether the back-end should be sent search string query parameters.
    if (typeof queryParams.search !== 'undefined' && queryParams.search != '') {
      queryElements.push('search=' + queryParams.search);
    }
    if (typeof queryParams.method !== 'undefined' && queryParams.method != '') {
      if (queryParams.method == 'lemma') {
        queryElements.push('method=lemma');
      }
    }
    const query = Object.keys(queryElements)
      .map(k => queryElements[k])
      .join('&');
    return this.getResponseFromPath('texts?' + query + '&_format=json');
  }

  getCorpusDetailByAttributes(attributes) {
    const queryElements = [];
    for (let key of Object.keys(attributes)) {
      queryElements.push(key + '=' + attributes[key]);
    }
    const query = Object.keys(queryElements)
      .map(k => queryElements[k])
      .join('&');
    return this.getResponseFromPath('texts?' + query + '&_format=json');
  }

  getDefaultCorpusSearchResults() {
    return this.getResponseFromPath('texts/word?&_format=json');
  }

  getPage(path) {
    return this.getResponseFromPath('pages?path=' + path + '&_format=json');
  }

  getRepositoryDetail(id) {
    return this.getResponseFromPath('resources?id=' + id + '&_format=json');
  }

  getTotalWords() {
    return this.getResponseFromPath('frequency/total');
  }

  // The abstracted method that all http requests use.
  getResponseFromPath(path) {
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