// Angular-specific modules used by this particular application.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components : the business logic for different page types.
import { AppComponent } from './app.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { NotFoundComponent } from './404/notfound.component';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';
import { CorpusSearchComponent } from './corpus/corpus-search.component';
import { CorpusDetailComponent } from './corpus/corpus-detail.component';
import { RepositorySearchComponent } from './repository/repository-search.component';
import { RepositoryDetailComponent } from './repository/repository-detail.component';

// Define what URL paths map to which components.
import { AppRoutingModule } from './app-routing.module';

// Services : helper classes for advanced logic.
import { APIService } from './services/api.service';
import { RequestCache } from './services/request-cache.service';
import { CachingInterceptor } from './services/caching-interceptor.service';
import { AssignmentDescriptionService } from './services/assignmentDescription.service';
import { CourseDescriptionService } from './services/courseDescription.service';

// Pipes : Helper methods to alter behavior.
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';

// Declarations are to make directives (including components and pipes)
// from the current module available to other directives in the current module.

// Providers are to make services and values known to dependency injection.
// They are added to the root scope and they are injected to other
// services or directives that have them as dependency.
@NgModule({
  declarations: [
    AppComponent,
    AuthorizeComponent,
    EscapeHtmlPipe,
    HomeComponent,
    PageComponent,
    CorpusSearchComponent,
    CorpusDetailComponent,
    RepositorySearchComponent,
    RepositoryDetailComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    APIService,
    AssignmentDescriptionService,
    CourseDescriptionService,
    RequestCache,
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
