import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// Translation
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateDirective } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// feature modules
import { AuthModule } from 'src/auth/auth.module';
import { ActivitiesModule } from 'src/activities/activities.module';

import { Store } from 'src/store';

// containers
import { AppComponent } from './containers/app.component';
// components
// import { HeaderComponent } from './components/header/header.component';
// import { NavComponent } from './components/nav/nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Materials Modules
// import {MaterialModule} from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) { //Enable to make translation requests via Http methods
  return new TranslateHttpLoader(http); // Le loader sert uniquement à renvoyer un observable contenant le disctionnaire de traduction
}

const ROUTES: Routes = [
  {path:'**', redirectTo:'/'}];

@NgModule({
  declarations: [
    AppComponent,
    // HeaderComponent,
    // NavComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    ActivitiesModule,
    RouterModule.forRoot(ROUTES),
    BrowserAnimationsModule,
    
    TranslateModule.forRoot({ //Once we've decided which loader to use, we have to setup the TranslateModule to use it.
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    defaultLanguage: 'fr'     // modifié dans le appComponent constructor
  }),
  HttpClientModule,

  // MaterialModule,
  MatProgressBarModule

  // AppRoutingModule,
],
providers: [
    Store
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

