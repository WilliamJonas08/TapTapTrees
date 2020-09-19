import { Component, OnInit } from '@angular/core';
import { Store } from 'src/store';
import { databaseResult, TreeService } from 'src/activities/shared/services/tree/tree.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  _displayDifficulty: string = "easy" //defines which leaderboard difficulty the user want to display
  displayName: string

  userResultOutsideLeaderboard: { easy: databaseResult[], moderate: databaseResult[], hard: databaseResult[] } = { easy: [/*easy_results*/], moderate: [/*moderate_results*/], hard: [/*hard_results*/] }
  leaderboard: { easy: databaseResult[], moderate: databaseResult[], hard: databaseResult[] } = { easy: [/*easy_results*/], moderate: [/*moderate_results*/], hard: [/*hard_results*/] }
  leaderboardLength: number = 10 //Définit le nombre maximum de personnes à afficher dans le leaderboard par catégorie de difficulté


  constructor(private store: Store, private treeService: TreeService) { }

  ngOnInit() {
    this.displayName = this.store.value.user.displayName
    this.setLeaderboard()
  }

  setLeaderboard() {
    this.treeService.results$.subscribe((leaderboard) => {
      //PB : le subscribe est appellé 12 fois de trop (inutilement)
        this.leaderboard = { easy: [/*easy_results*/], moderate: [/*moderate_results*/], hard: [/*hard_results*/] }
        const leaderBoardStructure = ['easy', 'moderate', 'hard'] //ou Object.key(this.leaderboard) si on l'appelle dans le subscribe
        // TODO : ajouter survival (et autres modes de jeu)
        //Pour chaque user, on ajoute ses résultats à chaque catégorie
        leaderboard.forEach((userResults) => {
          for (let difficulty of leaderBoardStructure) { //pour chaque difficulté expérimentée par le user
            let result = this.treeService.getResult(userResults, difficulty).result//on ne garde que la partie intéressante des résultats de la db
            if (result) {
              this.leaderboard[difficulty].push(result)
              
            }
          }
        })

      // On filtre le leaderBoard et on le trie 
      for (let difficulty of leaderBoardStructure) {
        
        const userResultExist = this.leaderboard[difficulty].find(element => element.displayName === this.displayName)
        this.userResultOutsideLeaderboard[difficulty] = userResultExist ? userResultExist : { score: 0, displayName: this.displayName, difficulty }
        // this.userResultOutsideLeaderboard[difficulty] = { ...this.userResultOutsideLeaderboard[difficulty] }
        
        
        this.leaderboard[difficulty] = this.leaderboard[difficulty].sort((a, b) => b.score - a.score).slice(0, this.leaderboardLength)
        
        const foundInFilteredLeaderboard = this.leaderboard[difficulty].find(element => element.displayName === this.displayName)
        if (foundInFilteredLeaderboard) {
          this.userResultOutsideLeaderboard[difficulty] = null
          // this.userResultOutsideLeaderboard[difficulty] = { ...this.userResultOutsideLeaderboard[difficulty] }
        }
      }
    
    })
  }

}
