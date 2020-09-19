import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

  axeTouched: boolean = false //Enable red alert when axe is touched
  comboEventTargetState:boolean=false

  @Input()
  score: number

  @Input()
  timeCounter: number

  @Input()
  fireMode:boolean

  @Input()
  axeTouchedSubject: Subject<any>

  @Input()
  goldCollected: number

  constructor() { }

  ngOnInit(): void {
    this.axeTouchedSubject.subscribe(() => {
      this.axeTouched = true
      setTimeout(() => this.axeTouched = false, 1000) //Durée d'affichage de l'alerte rouge
    })
  }

  onAnimationEventEnds(event) {
    this.comboEventTargetState = !event.toState
    // this.comboEventTargetState2 = !event.toState
  }


}
