import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  isAuthenticated: boolean = false;
  statusMessage: string = "";
  authenticating: boolean = false;
  corpusFacets: any[] = [];
  repositoryFacets: any[] = [];
}