import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components.
import { NotFoundComponent } from './404/notfound.component';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';
import { CorpusSearchComponent } from './corpus/corpus-search.component';
import { CorpusDetailComponent } from './corpus/corpus-detail.component';
import { RepositorySearchComponent } from './repository/repository-search.component';
import { RepositoryDetailComponent } from './repository/repository-detail.component';

// Define the application's available page paths.
const appRoutes: Routes = [
  { path: 'page/:id', component: PageComponent },
  { path: 'corpus', component: CorpusSearchComponent },
  { path: 'corpus/:id', component: CorpusDetailComponent },
  { path: 'repository/:id', component: RepositoryDetailComponent },
  { path: 'repository', component: RepositorySearchComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
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