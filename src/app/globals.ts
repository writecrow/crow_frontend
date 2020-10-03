import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  isAuthenticated = false;
  inProgress = false;
  statusMessage = "";
  authenticating = false;
  username = '';
  corpusFacets: any[] = [];
  currentUrl = '';
  previousUrl = '';
  threeUrl = '';
  repositoryFacets: any[] = [];
}
