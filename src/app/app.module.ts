import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components : the business logic for different page types.
import { AppComponent } from './app.component';
import { NotFoundComponent } from './404/notfound.component';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';
import { CorpusSearchComponent } from './corpus/search.component';
import { CorpusTextComponent } from './corpus/text.component';
import { RepositorySearchComponent } from './repository/search.component';
import { RepositoryResourceComponent } from './repository/resource.component';

// Services : helper classes for advanced logic.
import { APIService } from './services/api.service';
// The cache implementation below follows https://fullstack-developer.academy/caching-http-requests-with-angular/
import { RequestCache } from './services/request-cache.service';
import { CachingInterceptor } from './services/caching-interceptor.service';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from "@angular/router";

// Define the application's available page paths.
const appRoutes: Routes = [
  { path: 'page/:id', component: PageComponent },
  { path: 'corpus', component: CorpusSearchComponent },
  { path: 'corpus/:id', component: CorpusTextComponent },
  { path: 'repository/:id', component: RepositorySearchComponent },
  { path: 'repository', component: RepositoryResourceComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

// Declarations are to make directives (including components and pipes)
// from the current module available to other directives in the current module.

// Providers are to make services and values known to dependency injection.
// They are added to the root scope and they are injected to other
// services or directives that have them as dependency.
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageComponent,
    CorpusSearchComponent,
    CorpusTextComponent,
    RepositorySearchComponent,
    RepositoryResourceComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
  ],
  providers: [
    APIService,
    RequestCache,
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
