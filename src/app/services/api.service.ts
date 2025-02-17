import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

  getUser() {
    return this.getResponseFromPath('api/account');
  }

  searchCorpus(path) {
    return this.getResponseFromPath('corpus?' + path);
  }

  exportCorpus(path) {
    return this.getResponseFromPath('corpus/export?' + path, 'csv');
  }

  offlineCorpus() {
      this.observable = this.http.get(environment.backend + 'corpus/offline', {
        observe: 'response', responseType: 'blob'
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

  getCorpusSearchApiQuery(params, filenames = [], all = false) {
    const queryParameters = [];
    const localParams = ["numbering"];
    if (typeof params["search"] !== "undefined" && typeof params["display"] == "undefined") {
      queryParameters.push('display=kwic');
    }
    for (const key in params) {
      if (localParams.includes(key) && all === false) {
        // Do not pass params only used in frontend.
        continue;
      }
      queryParameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
    }
    if (filenames.length > 0) {
      queryParameters.push('filenames=' + filenames.join('+'));
    }
    const query = Object.keys(queryParameters)
      .map(k => queryParameters[k])
      .join('&');
    return query;
  }

  getSubsetFrequency(params) {
    const queryParameters = [];
    if (typeof params.category !== 'undefined') {
      queryParameters.push('category=' + params.category);
    }
    if (typeof params.name !== 'undefined') {
      queryParameters.push('name=' + params.name);
    }
    const query = Object.keys(queryParameters)
      .map(k => queryParameters[k])
      .join('&');
    return this.getResponseFromPath('frequency?' + query);
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

  postRequest(url, data) {
    this.observable = this.http.post<any>(environment.backend + url + '?_format=json', data).pipe(map(response => {
      this.observable = null;
      return response;
    })
    ).pipe(share());
    return this.observable;
  }

  // The abstracted method that all http requests use.
  getResponseFromPath(path, format = 'json') {
    let param = '?';
    if (path.includes('?')) {
      param = '&';
    }
    if (format === 'csv') {
      this.observable = this.http.get(environment.backend + path + param + '_format=' + format, {
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
    }
    else {
      this.observable = this.http.get(environment.backend + path + param + '_format=' + format, {
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
