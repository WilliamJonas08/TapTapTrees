import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthService } from 'src/auth/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  error: string

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async registerUser(event: FormGroup) {
    const { email, password, pseudo } = event.value //Object destructuring
    try {
      await this.authService.createUser(email, password, pseudo)
      this.router.navigate(['/tree'])
    }
    catch (err) {
      this.error = err.message
    }
  }
}
