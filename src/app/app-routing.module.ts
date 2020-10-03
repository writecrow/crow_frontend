import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components.
import { AuthorizeComponent } from './authorize/authorize.component';
import { NotFoundComponent } from './404/notfound.component';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';
import { ReportBugComponent } from './reportbug/reportbug.component';
import { CorpusSearchComponent } from './corpus/corpus-search.component';
import { CorpusDetailComponent } from './corpus/corpus-detail.component';
import { RepositorySearchComponent } from './repository/repository-search.component';
import { RepositoryDetailComponent } from './repository/repository-detail.component';

// Define the application's available page paths.
const appRoutes: Routes = [
  { path: 'authorize', component: AuthorizeComponent},
  { path: 'page/:id', component: PageComponent },
  { path: 'corpus', component: CorpusSearchComponent },
  { path: 'corpus/:id', component: CorpusDetailComponent },
  { path: 'problems', component: ReportBugComponent },
  { path: 'repository/:id', component: RepositoryDetailComponent },
  { path: 'repository', component: RepositorySearchComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- Set 'true' for debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
