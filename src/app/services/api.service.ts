import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { empty } from 'rxjs';

@Injectable()
export class APIService {

  constructor(private http: HttpClient) { }

  observable;

  getCorpusDetailById(filename, queryParams) {
    const queryElements = [];
    queryElements.push('filename=' + filename);
    // Determine whether the back-end should be sent search string query parameters.
    if (typeof queryParams.search !== 'undefined' && queryParams.search !== '') {
      queryElements.push('search=' + queryParams.search);
    }
    if (typeof queryParams.method !== 'undefined' && queryParams.method !== '') {
      if (queryParams.method === 'lemma') {
        queryElements.push('method=lemma');
      }
    }
    const query = Object.keys(queryElements)
      .map(k => queryElements[k])
      .join('&');
    return this.getResponseFromPath('corpus/metadata?' + query);
  }

  getCorpusReferenceByMetadata(attributes) {
    const queryElements = [];
    for (const key of Object.keys(attributes)) {
      // It's important to encode, as there may be spaces.
      queryElements.push(key + '=' + encodeURIComponent(attributes[key]));
    }
    const query = Object.keys(queryElements)
      .map(k => queryElements[k])
      .join('&');
    return this.getResponseFromPath('corpus/metadata?' + query);
  }

  getFrequencyData(attributes) {
    const queryElements = [];
    for (const key of Object.keys(attributes)) {
      // It's important to encode, as there may be spaces.
      queryElements.push(key + '=' + encodeURIComponent(attributes[key]));
    }
    const query = Object.keys(queryElements)
      .map(k => queryElements[k])
      .join('&');
    return this.getResponseFromPath('frequency/search?' + query);
  }

  getPage(path) {
    return this.getResponseFromPath('pages?path=' + path);
  }

  getRepositoryDetailById(id) {
    return this.getResponseFromPath('repository/metadata?id=' + id);
  }

  getRepositoryReferenceByMetadata(attributes) {
    const queryElements = [];
    for (const key of Object.keys(attributes)) {
      // It's important to encode, as there may be spaces.
      queryElements.push(key + '=' + encodeURIComponent(attributes[key]));
    }
    const query = Object.keys(queryElements)
      .map(k => queryElements[k])
      .join('&');
    return this.getResponseFromPath('repository/metadata?' + query);
  }

  getRoles() {
    return this.getResponseFromPath('user/roles?');
  }

  searchCorpus(path) {
    return this.getResponseFromPath('corpus?' + path);
  }

  exportCorpus(path) {
    return this.getResponseFromPath('corpus/export?' + path, 'csv');
  }

  getCorpusSearchApiQuery(params) {
    const queryParameters = [];
    const nonFacets = ["method", "search", "id", "op", "toefl_total_min", "toefl_total_max"];
    const inc = 0;
    for (const key in params) {
      if (nonFacets.includes(key)) {
        queryParameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      } else {
        queryParameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      }
    }
    const query = Object.keys(queryParameters)
      .map(k => queryParameters[k])
      .join('&');
    return query;
  }

  searchRepository(params) {
    const queryParameters = [];
    if (typeof params.search !== 'undefined') {
      queryParameters.push('search=' + params.search);
    }
    // Parse all front-end query parameters to construct API URL query.
    // 1. Parse active facets.
    let inc = 0;
    for (const key in params) {
      if (key !== 'search') { // Skip 'search' parameter here.
        const selections = params[key].split(',');
        for (const i of Object.keys(selections)) {
          queryParameters.push('f[' + inc + ']=' + key + ':' + encodeURIComponent(selections[i]));
          inc++;
        }
      }
    }
    const query = Object.keys(queryParameters)
      .map(k => queryParameters[k])
      .join('&');
    return this.getResponseFromPath('repository?' + query);
  }

  // The abstracted method that all http requests use.
  getWriteCrowNews() {
    this.observable = this.http.get("https://writecrow.org/wp-json/wp/v2/posts?categories=96", {
      observe: 'response', responseType: 'json'
    })
      .pipe(map(response => {
        this.observable = null;
        if (response.status === 200) {
          return response.body;
        }
      })
      ).pipe(share());
    return this.observable;
  }

  submitIssue(title, description, contact, url, userAgent) {
    this.observable = this.http.post<any>(environment.backend + 'submit-issue?_format=json', {
        title: title,
        description: description,
        contact: contact,
        url: url,
        user_agent: userAgent,
      }).pipe(map(response => {
        this.observable = null;
        if (response.status === 200) {
          return response.body;
        }
      })
      ).pipe(share());
    return this.observable;
  }

  // The abstracted method that all http requests use.
  getResponseFromPath(path, format = 'json') {
    if (format === 'csv') {
      this.observable = this.http.get(environment.backend + path + '&_format=' + format, {
        observe: 'response', responseType: 'text'
      })
        .pipe(map(response => {
          this.observable = null;
          if (response.status === 200) {
            return response.body;
          }
        })
        ).pipe(share());
      return this.observable;
    } else {
      this.observable = this.http.get(environment.backend + path + '&_format=' + format, {
        observe: 'response'
      })
        .pipe(map(response => {
          this.observable = null;
          if (response.status === 200) {
            return response.body;
          }
        })
        ).pipe(share());
      return this.observable;
    }

  }

}
