import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { FeedbackComponent } from './containers/feedback/feedback.component';
import { OptionsComponent } from './containers/options/options.component';

const ROUTES: Routes = [
  { path: '', component: OptionsComponent },
];

@NgModule({
  declarations: [FeedbackComponent, OptionsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule
  ],
  providers:[
    SharedModule
  ]
})
export class FeedbackModule { }
