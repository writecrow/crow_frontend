import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  currentUrl = '';
  isAuthenticated = false;
  inProgress = false;
  statusMessage = "";
  authenticating = false;
  username = '';
  corpusFacets: any[] = [];
  repositoryFacets: any[] = [];
}
