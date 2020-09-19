import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from 'src/store';
import { Router } from '@angular/router';
import {
  Result,
  TreeService,
  shopItem,
} from 'src/activities/shared/services/tree/tree.service';
import { User } from 'src/auth/shared/services/auth.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit, AfterViewInit {
  currentDifficulty: string; //defines the difficulty the have been played and the future game configuration

  /** Définit si une partie a été jouée avant d'arriver sur le setup -> affichage décompte score etc*/
  gameHaveBeenPlayedBefore: boolean = false;

  // classicItemsOwned: Array<shopItem>;

  /**Score affiché incrémenté jusque  au score obtenu précédemment (sans bonus) */
  displayedScore: number = 0;
  /**Score affiché incrémenté jusque au scoreBonus obtenu précédemment */
  displayedBonusScore: number = 0;
  /** defines if the user beat his own record */
  bestScore: boolean = false;
  /** Percentage of the initialScore added to the score */
  percentageBonusAdded: number;
  /**defines when the bonus percentage have to be displayed */
  showBonus: boolean = false;

  /** Defines when the user can click to play */
  canPressPlay: boolean = false;
  /** Defines if the user see the game rules*/
  showRules:boolean =false

  result: Result;
  userRecords: { easy: number; moderate: number; hard: number };
  constructor(
    private store: Store,
    private router: Router,
    private treeService: TreeService // private cd: ChangeDetectorRef
  ) {
    // this.cd.detectChanges(); //Permet de ne pas détecter le changement de "showBonus" une fois la vue checked
  }

  ngOnInit(): void {
    this.store.select('difficulty').subscribe((difficulty: string) => {
      this.currentDifficulty = difficulty;
    });
    //Pour afficher les records de chaque difficulté
    //TODO : reprendre
    // this.userRecords = {
    //   easy: this.treeService.getUserRecord('easy'),
    //   moderate: this.treeService.getUserRecord('moderate'),
    //   hard: this.treeService.getUserRecord('hard'),
    // };

    this.store.select('result').subscribe((result: Result) => {
      this.result = result;

      //On (ré)évalue
      // this.gameHaveBeenPlayedBefore =
      //   this.result !== undefined /*lancement appli*/ &&
      //   // ||
      //   this.result?.score > 0; /*partie non abandonnée*/
    });

    this.gameHaveBeenPlayedBefore =
      this.result !== undefined /*lancement appli*/ &&
      this.result?.score > 0; /*partie non abandonnée*/

    setTimeout(() => {
      this.canPressPlay = true;
    }, 2000);
  }

  ngAfterViewInit() {
    if (this.gameHaveBeenPlayedBefore && this.result.score > 0) {
      //Calcul du bonus de score
      this.percentageBonusAdded = this.treeService.getUserPercentageBonuses()[0];
      this.showBonus = true;

      //Calculs score initial et scoreBonus
      const correctif = this.percentageBonusAdded > 0 ? 1 : 0; //Pour ne pas diminuer le score du joueur lors du calcul
      const scoreWithoutBonus = Math.floor(
        this.result.score / (1 + this.percentageBonusAdded / 100) + correctif
      );
      // const scoreBonus = (this.percentageBonusAdded / 100) * scoreWithoutBonus;

      //Incrémentations des scores affichés
      const incrementationInterval = setInterval(() => {
        this.displayedScore = Math.floor(this.displayedScore + 1);
      }, 3000 / scoreWithoutBonus); //le résult sera disponible en temps normal de cycle de jeu

      setTimeout(() => {
        this.displayedScore = scoreWithoutBonus;
        clearInterval(incrementationInterval);
      }, 3000);

      //1s après la fin de l'incrémentation précédente, on cumule les bonus
      setTimeout(() => {
        //Maj displayScore avec le bonus
        this.displayedScore = this.result.score; //= scoreWithoutBonus + scoreBonus;
        this.showBonus = false;

        //Affichage de best score ?
        const userRecord = this.treeService.getUserRecord(
          this.result?.difficulty
        ); /*this.userRecords[this.result?.difficulty]*/ //le résult sera disponible en temps normal d ecycle de jeu
        //IMPORTANT : si le user vient de faire un score supérieur ou égal a son ancien record, on aura userRecord===this.result.score
        if (userRecord === this.result.score) {
          this.bestScore = true;
        }

        //Ce timeout va faire disparaitre l'affichage du score après 5s
        // setTimeout(()=>{
        this.store.set('result', {
          game: this.store.value.result.game,
          difficulty: this.store.value.result.difficulty,
          score: -1, //Pour ne pas réafficher l'animation si on fait un aller retour dans la nav-bar: on met le score à -1
        });
        // },5000)
      }, 4000);
    }
  }

  play() {
    this.router.navigate(['tree/game']);
  }

  toggleDifficulty(direction: string) {
    this.gameHaveBeenPlayedBefore = false; //Pour afficher les infos des difficultés
    if (direction === 'more') {
      if (this.currentDifficulty === 'easy') {
        this.store.set('difficulty', 'moderate');
        this.currentDifficulty = 'moderate';
        return;
      }
      if (this.currentDifficulty === 'moderate') {
        this.store.set('difficulty', 'hard');
        this.currentDifficulty = 'hard';
        return;
      }
      if (this.currentDifficulty === 'hard') {
        this.store.set('difficulty', 'easy');
        this.currentDifficulty = 'easy';
        return;
      }
    }
    if (this.currentDifficulty === 'easy') {
      this.store.set('difficulty', 'hard');
      this.currentDifficulty = 'hard';
      return;
    }
    if (this.currentDifficulty === 'moderate') {
      this.store.set('difficulty', 'easy');
      this.currentDifficulty = 'easy';
      return;
    }
    if (this.currentDifficulty === 'hard') {
      this.store.set('difficulty', 'moderate');
      this.currentDifficulty = 'moderate';
      return;
    }
  }
}
