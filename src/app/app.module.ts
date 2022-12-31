// Angular-specific modules used by this particular application.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components : the business logic for different page types.
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { DownloadComponent } from './download/download.component';
import { NotFoundComponent } from './404/notfound.component';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';
import { ReportBugComponent } from './reportbug/reportbug.component';
import { CorpusSearchComponent, DialogEmbed } from './corpus/corpus-search.component';
import { CorpusDetailComponent } from './corpus/corpus-detail.component';
import { RepositoryHelper } from './repository/repository-helper';
import { RepositorySearchComponent } from './repository/repository-search.component';
import { RepositoryDetailComponent } from './repository/repository-detail.component';

// See https://stackoverflow.com/a/70390035
declare global {
    interface Navigator {
        msSaveBlob: (blob: Blob, fileName: string) => boolean
    }
}

// Define what URL paths map to which components.
import { AppRoutingModule } from './app-routing.module';

// Services : helper classes for advanced logic.
import { APIService } from './services/api.service';
import { RequestCache } from './services/request-cache.service';
import { CachingInterceptor } from './interceptors/caching-interceptor.service';

import { RequestInterceptor } from './interceptors/request.interceptor';
export function tokenGetter() {
  return localStorage.getItem('token');
}

import { authorizeService } from './services/authorize.service';
import { HandleErrorService } from './services/handle-error.service';
import { LoginService } from './services/login.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { ToggleDirective } from './authorize/toggle.directive';
import { Globals } from './globals';

// Pipes : Helper methods to alter behavior.
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Declarations are to make directives (including components and pipes)
// from the current module available to other directives in the current module.

// Providers are to make services and values known to dependency injection.
// They are added to the root scope and they are injected to other
// services or directives that have them as dependency.
@NgModule({
    declarations: [
        AppComponent,
        AccountComponent,
        AuthorizeComponent,
        DialogEmbed,
        DownloadComponent,
        EscapeHtmlPipe,
        HomeComponent,
        PageComponent,
        CorpusSearchComponent,
        CorpusDetailComponent,
        ReportBugComponent,
        RepositorySearchComponent,
        RepositoryDetailComponent,
        NotFoundComponent,
        ToggleDirective,
    ],
    exports: [
        MatDialogModule,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatNativeDateModule,
        MatTabsModule,
        BrowserAnimationsModule,
    ],
    providers: [
        APIService,
        authorizeService,
        RepositoryHelper,
        Globals,
        HandleErrorService,
        LoginService,
        RefreshTokenService,
        RequestCache,
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
