import { Component, OnInit } from '@angular/core';
import { Store } from 'src/store';
import { Observable } from 'rxjs';
import { User } from 'src/auth/shared/services/auth.service';
import { TreeService } from 'src/activities/shared/services/tree/tree.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$:Observable<User>
  percentageTreeBonus:number
  percentageGoldBonus:number

  constructor(private store: Store, private treeService:TreeService) { }

  ngOnInit(): void {
    this.user$=this.store.select('user')

    const bonuses = this.treeService.getUserPercentageBonuses();
    this.percentageTreeBonus=bonuses[0]
    this.percentageGoldBonus=bonuses[1]
  }

}
