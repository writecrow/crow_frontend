import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  isAuthenticated = false;
  statusMessage = "";
  authenticating = false;
  corpusFacets: any[] = [];
  repositoryFacets: any[] = [];
}
