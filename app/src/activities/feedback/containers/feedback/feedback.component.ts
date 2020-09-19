import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FeedbackService } from 'src/activities/shared/services/feedback/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {

  // displayEmail = true
  // emailControlValue:string = ''

  form = this.fb.group({
    // email: [this.emailControlValue, Validators.email],
    feedback: ['', Validators.required]
  })


  constructor(private fb: FormBuilder, private feedbackService:FeedbackService, private router:Router) { }

  async onSubmit() {
    if (this.form.valid) {
      await this.feedbackService.addFeedback(this.form.value)
      this.router.navigate(['/tree'])
    }
  }

  // toggleDisplayEmail() {
  //   this.displayEmail = !this.displayEmail
  //   if(!this.displayEmail){
  //     //email par défaut si le user ne veut pas le mentionner
  //     this.emailControlValue=' '
  //     return
  //   }
  //   // si on veut envoyer un email
  //   this.emailControlValue=''
  // }

  // Validation
  
  // get emailFormat() {
  //   const control = this.form.get('email')
  //   return control.touched //control.hasError("email") &&
  // }

  get feedbackInvalid() {
    const control = this.form.get('feedback')
    return (control.hasError("required") && control.touched)
  }
}
