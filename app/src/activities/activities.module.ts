import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Translation
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) { //Enable to make translation requests via Http methods
  return new TranslateHttpLoader(http); // Le loader sert uniquement à renvoyer un observable contenant le disctionnaire de traduction
}

// shared modules
import { SharedModule } from './shared/shared.module';

// Guards
import { AuthGuard } from 'src/auth/shared/guards/auth.guards';


const ROUTES: Routes = [
  { path: 'tree', canActivate: [AuthGuard], loadChildren: () => import('./tree/tree.module').then(m => m.TreeModule) },
  { path: 'options', canActivate: [AuthGuard], loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule) },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(ROUTES),
    SharedModule.forRoot(),
    // TranslateModule.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   },
    //   extend: true
    // })
  ]
})
export class ActivitiesModule { }
