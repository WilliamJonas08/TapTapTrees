import { Component, OnInit } from '@angular/core';
import { Store } from 'src/store';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  currentDifficulty: string;

  constructor(private store: Store) {}

  ngOnInit() {}
}
