import { Component, OnInit } from '@angular/core';
import { Store } from 'src/store';
import { Observable } from 'rxjs';
import { User } from 'src/auth/shared/services/auth.service';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  user$ :Observable<User>

  constructor(    
    private store: Store
    // private authService: AuthService,
    ) 
    {}

  ngOnInit(): void {
    this.user$ = this.store.select('user')
  }

}