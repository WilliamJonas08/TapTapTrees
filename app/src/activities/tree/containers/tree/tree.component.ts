import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory,
  OnInit,
} from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import {
  TreeService,
  GameParameters,
  Result,
  shopItem,
} from 'src/activities/shared/services/tree/tree.service';
import { Store } from 'src/store';

// On importe le child component pour pouvoir le créer dynamiquement avec une Factory
import { TreeIconComponent } from '../../components/tree-icon/tree-icon.component';
import { User } from 'src/auth/shared/services/auth.service';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  animations: [
    trigger('comboBorderBottomPulse', [
      state('false', style({ borderColor: '*' })),
      state('true', style({ borderColor: 'blue' })),
      transition('false <=> true', [
        animate(
          '5s',
          keyframes([
            style({ borderBottomColor: 'red' }),
            style({ borderBottomColor: 'black' }),
            style({ borderBottomColor: 'green' }),
          ])
        ),
      ]),
      // useAnimation(transAnimation, {
      //   params: {
      //     height: 0,
      //     opacity: 1,
      //     backgroundColor: 'red',
      //     time: '1s'
      //   }
      // })
    ]),
    trigger('comboBorderPulse', [
      // state('false', style({ borderColor:'*'})),
      // state('true', style({ borderColor:'orange' })),
      transition('false <=> true', [
        animate(
          '0.5s',
          keyframes([
            style({ borderColor: 'orange' }),
            style({ borderColor: 'black' }),
            style({ borderColor: 'orange' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class TreeComponent implements OnInit {
  result: Result = { game: 'tree', difficulty: 'easy', score: 0 };
  goldCollected: number; //Or récolté lors d'une partie
  private goldIconsGenerated: number; //Nombre d'icones d'or générés pendant la partie

  displayCountdown: boolean = false;
  countdown: number; //Décompte initial du jeu
  gameBloqued: boolean = false; //Permet de bloquer le click à le fin du jeu

  //TEMPS
  timeCounter: number = 0; //Barre de temps qui définit la fin du jeu si elle tombe à 0
  gameTimeCounter: number; //Définit le temps de jeu à l'intant t (incrémenté à chaque seconde du jeu)
  //counters définis ici pour pouvoir les destroy quand on leave le jeu
  private timeCounterInterval: any; //NodeJS.Timeout
  private gameTimeCounterInterval: any;
  // gameTime: number = 10000 //Définit la durée totale du jeu (dans le cas ou le jeu est limité dans le temps) //PAS ENCORE LE CAS

  //ERREURS ET COMBOS
  axeTouchedSubject = new Subject<any>(); //avertit les components que une hache a été touchée
  mistakeMode: boolean = false; //indique si une hache a été touchée
  comboCounter: number = 0; //Indique le nombre de clicks réussis d'affilée par le user
  fireMode: boolean; //= this.comboCounter >=10
  comboEventTargetState: boolean = false;
  comboEventTargetState2: boolean = false;
  displayComboInfo: boolean = false; //Si on affiche le message "mode combo" ou non

  //BOOSTERS
  boostersArray: {
    itemName: string;
    number: any;
    boosterUsed: boolean /*if clicked during the game*/;
  }[] = [];
  timeCounterIntervalBloqued: boolean = false;

  // Paramètres à changer dynamiquement avec la taille de l'écran:
  private plateSize: { width: number; height: number }; //en px
  private treeIconSize: number; //px  =plateSize.width/10
  private gameBordersWidth: number = 12; //uniquement la largeur de la bordure de la class "game"
  private gameContainerBordersWidth: number = 0; //uniquement dans le cas d'un téléphone
  private counterHeight: number = 0;
  private boosterBarHeight: number = 0;

  @ViewChild('iconRef', { read: ViewContainerRef }) iconRef: ViewContainerRef; // Création dynamique du child component
  components: ComponentRef<TreeIconComponent>[] = []; //Array of our components
  treeIconFactory: ComponentFactory<TreeIconComponent>;

  constructor(
    private resolver: ComponentFactoryResolver /* Create a componement factory based on our child component*/,
    private store: Store,
    private treeService: TreeService,
    private router: Router
  ) {
    this.treeIconFactory = this.resolver.resolveComponentFactory(
      TreeIconComponent
    );
  } // Création de la factory du TreeInconComponent

  ngOnInit() {
    this.axeTouchedSubject.subscribe(() => {
      this.mistakeMode = true;
      setTimeout(() => (this.mistakeMode = false), 1000); //Durée d'affichage de l'alerte rouge
    });

    const difficulty: string = this.store.value.difficulty;
    // Définition taille plateau
    this.plateSize = { width: 550, height: 550 };
    this.treeIconSize = 100;
    if (window.innerWidth <= 567) {
      this.plateSize = { width: window.innerWidth, height: window.innerHeight };
      this.treeIconSize = this.plateSize.width / 6;
      this.gameContainerBordersWidth = 2 * 8; //dans le cas d'un téléphone window.innerWidth prend en compte les autres bordures que celle de "game" et donc celles de "game-container"
      this.counterHeight = 60; //cas tel, la hauteur du compteur est prise en compte dans la hauteur de l'écran
      this.boosterBarHeight = 60;
    }

    this.initializeBoosters();

    this.beginGame(difficulty);
  }

  beginGame(difficulty: string) {
    // Définition des paramètres du jeu
    this.displayCountdown = true;
    this.resetGameData();
    const gameParameters: GameParameters = this.treeService.getGameParameters(
      difficulty
    );
    this.result.difficulty = gameParameters.difficulty;

    //Le coefficient de temps détermine la difficulté de la partie liée au temps
    const timeCoefficient: number =
      gameParameters.difficulty === 'easy'
        ? 0.1
        : gameParameters.difficulty === 'moderate'
        ? 0.2
        : 0.3;
    // Délai avant le début du jeu (3s)
    let countdownInterval = setInterval(() => this.countdown--, 1000); //Toutes les secondes on incrémente le countdown
    setTimeout(() => {
      clearInterval(countdownInterval); //Décompte stoppé au bout de 3secondes
      this.displayCountdown = false;

      // ACTUALISATION TEMPS & BARRE DE TEMPS & FIN DU JEU
      this.gameTimeCounterInterval = setInterval(() => {
        this.gameTimeCounter++;
        //Check du score pour la génération d'icône d'or
        this.checkForGoldGeneration(
          this.result.score,
          gameParameters.scoreToReachForGold,
          gameParameters.iconsNumber
        );
      }, 1000);

      this.timeCounterInterval = setInterval(() => {
        if (!this.timeCounterIntervalBloqued) {
          //Si le temps n'est pas bloqué par un booster
          this.timeCounter =
            this.timeCounter -
            timeCoefficient * Math.sqrt(Math.sqrt(this.gameTimeCounter)); //timeCounter (barre) diminue de plus en plus vite avec le temps de jeu (gameTime)
        }

        if (this.timeCounter < 0) {
          this.endGame();
          // this.endGame([timeCounterInterval, gameTimeCounterInterval]);
        } //FIN DU JEU
      }, 50);

      // CRÉATION  ICONES
      let index = 0;
      let instantiationInterval = setInterval(() => {
        //Crée des composants jusqu'à ce qu'il soit stoppé par le timeout suivant
        this.instanciateOneIcon(index, gameParameters.speed);
        index++;
      }, gameParameters.speed);
      setTimeout(() => {
        clearInterval(instantiationInterval);
      }, gameParameters.speed * gameParameters.iconsNumber); //Stoppe la création des composants

      //Timeout pour déterminer la fin du jeu (DANS LE CAS D'UN JEU DE TEMPS DÉTERMINÉ)
      // setTimeout(() => {this.endGame()}, this.gameTime)
    }, this.countdown * 1000);
  }

  private resetGameData() {
    this.result.score = 0;
    this.countdown = 3;
    this.timeCounter = 100;
    this.gameTimeCounter = 1;
    this.comboCounter = 0;
    this.goldCollected = 0;
    this.goldIconsGenerated = 0;
  }

  private instanciateOneIcon(index: number, speed: number) {
    //Création des components
    this.components[index] = this.iconRef.createComponent(this.treeIconFactory);
    this.moveIcon(index);
    this.components[index].instance.touched.subscribe((iconData) => {
      this.onIconTouched(iconData, index, speed);
    });
  }

  private moveIcon(i: number) {
    this.components[i].instance.location.next(
      this.getRandomLocation(
        this.plateSize.width -
          this.treeIconSize -
          this.gameContainerBordersWidth,
        this.plateSize.height -
          this.treeIconSize -
          this.gameContainerBordersWidth -
          this.boosterBarHeight -
          this.counterHeight
      )
    );
  }

  private onIconTouched(iconData: [number, string], i: number, delay: number) {
    const [iconValue, iconType] = iconData;

    if (iconType !== 'axe' && iconType !== 'gold' && iconValue !== null) {
      //Si l'icone touché n'est pas une hache ni de l'or
      this.result.score =
        this.result.score + (this.fireMode ? 2 * iconValue : iconValue); //LE JOUEUR GAGNE PLUS DE POINTS EN FIREMODE

      const alreadyInFireMode = this.fireMode;
      this.comboCounter++;
      this.fireMode = this.comboCounter >= 10;
      //Voir si on affiche le message combo ou non
      if (this.fireMode && !alreadyInFireMode) {
        this.displayComboInfo = true;
        setTimeout(() => {
          this.displayComboInfo = false;
        }, 2000);
      }

      //Je joueur gagne du temps
      this.timeCounter = this.timeCounter + 5; //mettre boolean dans icontouched pour savoir si ça remonte + la barre de temps que la normale en fonction de la difficulté ?
      if (this.timeCounter > 100) {
        this.timeCounter = 100;
      }
    }

    // Si l'icon touché est une hache
    if (iconType === 'axe') {
      this.timeCounter = this.timeCounter - 5; // PÉNALITÉ pour avoir cliqué sur une hache
      this.restartCombo();
      this.axeTouchedSubject.next();
    }

    // Si l'icon touché est de l'or
    if (iconType === 'gold') {
      this.goldCollected += iconValue;
      this.components[this.components.length - 1].destroy(); // On supprime l'icône d'or
      this.components.splice(this.components.length - 1, 1);
      return;
      // TODO : faire une animation (au moins dans l'incrémentation des pièces) ?
    }
    setTimeout(() => {
      this.moveIcon(i);
    }, delay);
  }

  /**Vérifie si un icône d'or doit être généré
   * La fonction détruit l'icone d'or précédent si celui ci n'a pas été touché
   */
  private checkForGoldGeneration(
    actualScore: number,
    scoreToReach: number,
    iconsNumber: number
  ) {
    if (actualScore - (this.goldIconsGenerated + 1) * scoreToReach > 0) {
      this.goldIconsGenerated++;
      const indexGoldIcon = iconsNumber;
      //Si il y a déja un icône d'or, on le détruit pour en reconstruire un autre
      if (this.components.length === indexGoldIcon + 1) {
        this.components[indexGoldIcon].destroy();
      }
      this.instanciateOneIcon(indexGoldIcon, 0); // On ajoute un dernier component à notre liste d'icones
      this.components[indexGoldIcon].instance.iconIsGoldSubject.next(true);
    }
  }

  restartCombo() {
    //réinitialise le conteur de combo lorsque le user touche le plateau ou une hache
    this.comboCounter = 0;
    this.fireMode = false;
    this.comboEventTargetState = true; //Prépare le prochain combo
  }

  private getRandomLocation(
    maxWidth: number,
    maxHeight: number
  ): { X: string; Y: string } {
    // console.log(maxWidth,maxHeight)
    return {
      X:
        Math.floor(
          Math.random() * Math.floor(maxWidth) - this.gameBordersWidth
        ).toString() + 'px',
      Y:
        Math.floor(
          Math.random() * Math.floor(maxHeight) - this.gameBordersWidth
        ).toString() + 'px',
    };
  }

  private async endGame() {
    // intervals: Array<any>

    //Petite animation avec la couleur du plateau
    this.mistakeMode = true;
    this.gameBloqued = true;

    this.store.set('result', this.result);

    //On stoppe les timers
    let intervals: Array<any> = [
      this.timeCounterInterval,
      this.gameTimeCounterInterval,
    ];
    intervals.forEach((interval) => clearInterval(interval));

    setTimeout(() => {
      this.router.navigate(['tree/setup']);

      // Destroying items
      this.components.forEach((component) => {
        component.destroy();
      });
    }, 2000);
    await this.treeService.addResult(this.result, this.goldCollected);

  }

  leaveGame() {
    this.result.score = 0;
    this.goldCollected = 0;

    //Petite animation avec la barre de temps et la couleur du plateau
    this.timeCounter = 1;
    this.mistakeMode = true;

    // setTimeout(() => {
      this.endGame();
    // }, 1000);
  }

  onComboPulseEventEnds(event) {
    // console.log(event)
    this.comboEventTargetState = !event.toState;
    // this.comboEventTargetState2 = !event.toState
  }

  // onAnimationBottomEventEnds(event) {
  //   // console.log(event)
  //   // this.comboEventTargetState = !event.toState
  //   this.comboEventTargetState2 = !event.toState
  //   console.log('fini')
  // }

  //Boosters

  /**Initialisation des boosters disponibles au joueur */
  initializeBoosters() {
    const shopItems = this.treeService.getShopItems();

    //On ne conserve que les boosters parmi les items du shop
    const boostersItemsArray = shopItems.filter(
      (shopItem) => shopItem.type === 'booster'
    );
    const boostersNamesArray = boostersItemsArray.map((item) => item.itemName);

    // this.store.select('user').subscribe((userData: User) => {
    //Attention: si on subscribe, il ne faut pas diminuer manuellement (dans la vue plutot que dans le service) le nombre d'item lorsque l'un d'entre eux est utilisé
    // this.boostersArray=[]
    const userData: User = this.store.value.user; // On ne subscribe pas car on a besoin de l'info que une fois au debut
    Object.keys(userData.items).forEach((key) => {
      //Si le nom de l'item fait partie de la liste des noms de boosters
      // et si le user en a un nombre positif en stock
      if (
        boostersNamesArray.find((name) => name === key) &&
        userData.items[key][key] > 0
      ) {
        let newObj: {
          itemName: string;
          number: any;
          boosterUsed: boolean;
        } = {
          itemName: `${key}`,
          number: userData.items[key][key],
          boosterUsed: false,
        };
        this.boostersArray.push(newObj);
      }
    });
    // });
  }

  useBooster(boosterUsed: shopItem) {
    //le boosterUsed possède en réalité un champ supplémentaire mais on l'oubliera par la suite

    //Effet du booster
    if (boosterUsed.itemName === 'Régime-végétarien') {
      this.timeCounterIntervalBloqued = true; //Bloque l'écoulement du temps
      setTimeout(() => (this.timeCounterIntervalBloqued = false), 3000); //Débloque l'écoulement du temps
    }
    if (boosterUsed.itemName === 'Transport-propre') {
      this.fireMode = true;
      this.comboCounter = 10;
      this.displayComboInfo = true;
      setTimeout(() => {
        this.displayComboInfo = false;
      }, 2000);
    }

    //Permet d'afficher le booster comme utilisé
    this.boostersArray.map((booster) => {
      if (booster.itemName === boosterUsed.itemName) {
        booster.number = booster.number - 1;
        return (booster.boosterUsed = true);
      }
    });

    //Maj bdd
    this.treeService.useItem(boosterUsed.itemName);
  }
}
