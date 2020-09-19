import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/auth/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error: string

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async loginUser(event: FormGroup) {
    const { email, password, pseudo } = event.value //Object destructuring
    try {
      await this.authService.loginUser(email, password) //don't need to call .then with async/await
      this.router.navigate(['/tree'])
    }
    catch (err) {
      this.error = err.message
    }
  }

}
