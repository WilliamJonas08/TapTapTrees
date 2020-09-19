import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {

  @Input() // C'est tricher un peu .. mais je n'ai pas réussi avec le ng-content
  type: string

  @Output()
  submitted = new EventEmitter<FormGroup>()

  form

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // On le définit dans le OnInit (et non pas directement dans la définition de la propriété form) afin d'avoir la donnée "type" disponible (pas disponible avant)
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      pseudo: [(this.type === "login") ? ' ' : '', Validators.required]
    })
  }

  onSubmit() {
    if (this.form.valid) {
      // console.log(this.form.value.pseudo)
      this.submitted.emit(this.form)
    }
  }

  // Validation
  get passwordInvalid() {
    const control = this.form.get('password')
    return (control.hasError("required") && control.touched)
  }

  get emailFormat() {
    const control = this.form.get('email')
    return control.hasError("email") && control.touched
  }

  get pseudoInvalid() {
    const control = this.form.get('pseudo')
    return (control.hasError("required") && control.touched)
    // TODO: ajouter error max-length
  }


}
