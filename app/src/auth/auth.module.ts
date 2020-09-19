import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Translation
import {TranslateModule} from '@ngx-translate/core';

import { SharedModule } from './shared/shared.module';

// THIRD-PARTY MODULES
import { AngularFireModule, FirebaseAppConfig } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

const ROUTES: Routes = [{
  path: 'auth',
  children: [
    { path: '', pathMatch: 'full', redirectTo: 'login' }, //Default generated component 
    // Lazy loading children 
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
  ]
}
];

export const firebaseConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyB3aA0u4HRYLboIEn2_s1QaKANao4nXTbQ",
  authDomain: "fir-app-e94c4.firebaseapp.com",
  databaseURL: "https://fir-app-e94c4.firebaseio.com",
  projectId: "fir-app-e94c4",
  storageBucket: "fir-app-e94c4.appspot.com",
  messagingSenderId: "322635367327",
  appId: "1:322635367327:web:36ad3a206d0752b9ef73aa",
  measurementId: "G-D5ZL0CMZVV"
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTES),
    SharedModule.forRoot(), //avoid double instance of this service

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    TranslateModule // Export it in SharedModules ? Enable to don't import this module in each module which imports the sharedModule
  ]
})
export class AuthModule { }
