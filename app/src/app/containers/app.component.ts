import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Store } from 'src/store';

import { AuthService, User } from 'src/auth/shared/services/auth.service';
import { TreeService } from 'src/activities/shared/services/tree/tree.service';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// import { Component, HostBinding } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
    animations: [
    trigger('step', [
      state('begin', style({ opacity: 1})),
      state('middle', style({ opacity: 1})),
      state('end', style({ opacity: 0, })),
      transition('begin => middle', [animate('0s')]),
      transition('middle => end', [animate('1s')]),
    ]),
  ],
  // animations: [
  //   trigger('step', [
  //     state('begin', style({ color: "black", opacity: 1, backgroundColor: 'black' })),
  //     state('middle', style({ opacity: 1, color: 'white', backgroundColor: 'black' })),
  //     state('end', style({ opacity: 0, })),
  //     transition('begin => middle', [animate('2s')]),
  //     transition('middle => end', [animate('2s')]),
  //   ]),
  // ],
})
export class AppComponent implements OnInit, OnDestroy {

  user$: Observable<User>
  subscription: Subscription

  enteringGame: string | boolean =false //names of the steps of the animation


  constructor(
    private store: Store,
    private authService: AuthService,
    private treeService:TreeService,
    private router: Router,

    private translate: TranslateService,
    private http: HttpClient
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  ngOnInit() {
    this.subscription = this.authService.auth$.subscribe((auth) => {
      if (!auth) { this.router.navigate(['/auth/login'] ); return }
      this.router.navigate(['/tree/setup'])
    }) // Initiate the data flow for the subscription
    this.user$ = this.store.select<User>('user') //Mit à jour quand le store est mit à jour


    // Animation d'entrée TODO: voir comment enchainer sans cette logique
    this.enteringGame = "begin"
    setTimeout(() => {
      this.enteringGame = "middle"
      setTimeout(() => {
        this.enteringGame = "end"
        setTimeout(() => {
          this.enteringGame = false
          // TODO: ajouter attente si pas de connection (ou mode hors ligne ?)
        }, 2000)
      }, 3000)
    }, 2000)
  }


  async onLogout() {
    await this.authService.logoutUser()
    this.router.navigate(['/auth/login'])
  }

  ngOnDestroy() { //Ce component ne sera jamais détruit mais c'est une bonne pratique à avoir 
    this.subscription.unsubscribe()
  }



}
