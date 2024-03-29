import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  isAuthenticated = false;
  inProgress = false;
  statusMessage = "";
  authenticating = false;
  username = '';
  downloadUrl = false;
  userRoles: any[] = [];
  corpusFacets: any[] = [];
  selectedTexts: any[] = [];
  currentUrl = '';
  previousUrl = '';
  repositoryFacets: any[] = [];
}
