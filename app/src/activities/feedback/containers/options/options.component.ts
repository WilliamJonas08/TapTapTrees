import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Store } from 'src/store';

import { User, AuthService } from 'src/auth/shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  currentSection:string =''
  // user$: Observable<User>

  constructor(
    // private store: Store,
    private authService: AuthService,
    private router: Router,
    private translate:TranslateService
  ) { }

  ngOnInit() {
    // this.user$ = this.store.select<User>('user') //Mit à jour quand le store est mit à jour
  }

  display(section:string){
    if(section===this.currentSection){
      this.currentSection=''
      return
    }
    this.currentSection=section
  }

  async logoutUser() {
    await this.authService.logoutUser()
    this.router.navigate(['/auth/login'])
  }

  swithLanguage(language:string){
    this.translate.use(language)
  }

}

