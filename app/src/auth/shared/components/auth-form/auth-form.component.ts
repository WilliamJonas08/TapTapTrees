import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseApp } from '@angular/fire';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  @Input() // C'est tricher un peu .. mais je n'ai pas réussi avec le ng-content
  type: string;

  @Output()
  submitted = new EventEmitter<FormGroup>();

  resetingPassword: boolean = false; //Manage the display of the reset password page
  form_resetPassword;
  resetEmailSent: boolean = false;

  form;

  constructor(
    private fb: FormBuilder,
    private firebase: FirebaseApp,
    private router: Router
  ) {}

  ngOnInit(): void {
    // On le définit dans le OnInit (et non pas directement dans la définition de la propriété form) afin d'avoir la donnée "type" disponible (pas disponible avant)
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      pseudo: [this.type === 'login' ? ' ' : '', Validators.required],
    });

    this.form_resetPassword = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // console.log(this.form.value.pseudo)
      this.submitted.emit(this.form);
    }
  }

  // Validation
  get passwordInvalid() {
    const control = this.form.get('password');
    return control.hasError('required') && control.touched;
  }

  get emailFormat() {
    const control = this.form.get('email');
    return control.hasError('email') && control.touched;
  }

  get pseudoInvalid() {
    const control = this.form.get('pseudo');
    return control.hasError('required') && control.touched;
    // TODO: ajouter error max-length
  }

  get emailFormatReset() {
    const control = this.form_resetPassword.get('email');
    return control.hasError('email') && control.touched;
  }

  forgottenPassword(email) {
    let auth = this.firebase.auth();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        // Email sent.
        this.resetEmailSent = true;

        // setTimeout(() => {
        //   this.resetingPassword=false
        // }, 5000);
      })
      .catch(function (error) {
        // An error happened.
        console.log(error)
      });
  }
}
