import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

// containers
import { TreeComponent } from './containers/tree/tree.component';
import { SetupComponent } from './containers/setup/setup.component';
import { LeaderboardComponent } from './containers/leaderboard/leaderboard.component';

// components
import { CounterComponent } from './components/counter/counter.component';
import { TreeIconComponent } from './components/tree-icon/tree-icon.component';
import { SetupTypeComponent } from './components/setup-type/setup-type.component';
import { LeaderboardItemComponent } from './components/leaderboard-item/leaderboard-item.component';
import { FlameComponent } from './components/flame/flame.component';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import { GardenComponent } from './containers/garden/garden.component';
import { ProfileComponent } from './containers/profile/profile.component';


const ROUTES: Routes = [
  { path: '', children:[
    { path: 'setup', component: SetupComponent },
    { path: 'game', component: TreeComponent },
    { path: 'leaderboard', component: LeaderboardComponent },
    { path: 'garden', component: GardenComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: 'setup'},
  ] },
];

@NgModule({
  declarations: [
    TreeComponent,
    CounterComponent,
    TreeIconComponent,
    SetupComponent,
    SetupTypeComponent,
    LeaderboardItemComponent,
    FlameComponent,
    LeaderboardComponent,
    GardenComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    MatProgressBarModule,
    SharedModule
  ],
  providers: [
    SharedModule,
  ]
})
export class TreeModule { }
