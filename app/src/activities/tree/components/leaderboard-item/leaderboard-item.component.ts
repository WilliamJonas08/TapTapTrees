import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';

import { databaseResult } from 'src/activities/shared/services/tree/tree.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'leaderboard-item',
  templateUrl: './leaderboard-item.component.html',
  styleUrls: ['./leaderboard-item.component.scss']
})
export class LeaderboardItemComponent implements OnInit {

  name: string
  score: number
  // isPlayer: boolean = false

  @Input()
  // data: databaseResult
  set data(data:databaseResult){
    this.name = data.displayName
    this.score = data.score
  }

  @Input()
  rank:number | any

  // @Input()
  // displayName:string

  @Input()
  isPlayer:boolean

  constructor() { }

  ngOnInit(): void {
    // this.isPlayer = (this.displayName === this.data.displayName)
    // this.name = this.data.displayName
    // this.score = this.data.score
  }

}
