import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { User } from 'src/auth/shared/services/auth.service';

import { Store } from 'src/store';

export interface GameParameters {
  difficulty: string;
  iconsNumber: number;
  speed: number;
  scoreToReachForGold: number;
}

export interface Result {
  //Local result
  game: string;
  difficulty: string;
  score: number;
}

export interface databaseResult {
  // Database result
  difficulty: string;
  score: number;
  displayName: string;
  uid?: string

}

export interface shopItem {
  itemName: string;
  price: number;
  description: string;
  bonusValue: number;
  type: string /* classic ou booster */;
}

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  // private userID: string //this.authService.user.uid
  // private displayName: string

  results$ = this.db.list<databaseResult[]>(`tree`).valueChanges();
  // .pipe(
  //   tap((next) => {
  //     this.setUserResult(this.store.value.user.uid) //useless car il s'agit d'un subscribe (elle se maj tt seule je pense)
  //   })
  // switchMap((tree_database,index) => {
  //   console.log('tree_database',tree_database)
  //   // this.db.list(`tree`, ref => ref.orderByChild('score')).valueChanges()
  //   // return this.db.list(`tree`, ref => ref.orderByKey()).valueChanges()
  // })
  // )

  /**
   * Attention il s'agit d'un object dont les clés sont générées aléatoirement par FireBase
   * Nécessité d'utiliser getResults
   */
  userBestScores: databaseResult[];

  private gameParameters: GameParameters[] = [
    {
      difficulty: 'easy',
      iconsNumber: 1,
      speed: 500,
      scoreToReachForGold: 30,
    },
    {
      difficulty: 'moderate',
      iconsNumber: 2,
      speed: 400,
      scoreToReachForGold: 35,
    },
    {
      difficulty: 'hard',
      iconsNumber: 3,
      speed: 300,
      scoreToReachForGold: 10,
    },
  ];

  // TODO: exporter dans la BDD
  private SHOP_ITEMS: Array<shopItem> = [
    {
      itemName: 'Plant-a-tree',
      price: 25,
      // price: 50,
      description:
        'Augmente de 5% ton score pour chaque item possédé - Regardes une courte pub afin de planter de véritables arbres',
      bonusValue: 5,
      type: 'classic',
    },
    {
      itemName: 'Plant-a-coin',
      price: 25,
      // price: 50,
      description:
        "Augmente de 5% l'or collecté pour chaque item possédé - Regardes une courte pub afin de planter de véritables arbres",
      bonusValue: 5,
      type: 'classic',
    },
    {
      itemName: 'Régime-végétarien',
      price: 10,
      // price: 20,
      description:
        'Tu limites la déforestation et figes ainsi le temps pendant 3s.',
      bonusValue: 0,
      type: 'booster',
    },
    {
      itemName: 'Transport-propre',
      price: 15,
      // price: 20,
      description:
        'Plus de la moitié de tes émissions de CO2 est due aux transports. En choisissans ce mode de transport plus durable, tu passes instantanément en mode combo',
      bonusValue: 0,
      type: 'booster',
    },
  ];

  constructor(private db: AngularFireDatabase, private store: Store) {
    // TODO voir pour regrouper tous les subscribes
    this.store.select<User>('user').subscribe((user) => {
      //on utilise le subscribe pour être sur d'avoir les données user lors de l'appel de setUserResult
      this.setUserResult(user?.uid); //AUTRE SUBSCRIPTION
      // this.userID = user.uid
    });
    // TODO : si on ne veut pas appeller le subscribe 3 fois, on peut set le store avec la variable userResult (depuis le tree component , on init) que l'on récupérerait directement ici via le store
  }

  getGameParameters(difficulty: string) {
    return this.gameParameters.find(
      (parameter) => parameter.difficulty === difficulty
    );
  }

  getShopItems() {
    return this.SHOP_ITEMS;
  }

  async addResult(result: Result, goldCollected: number) {
    //Prise en compte du bonus des items classic
    const [
      percentageTreeBonus,
      percentageGoldBonus,
    ] = this.getUserPercentageBonuses();
    result.score = Math.floor(
      result.score + result.score * (percentageTreeBonus / 100)
    ); //Augmentation du score
    goldCollected = Math.floor(
      goldCollected + goldCollected * (percentageGoldBonus / 100)
    ); //Augmentation de l'or collecté

    // Ajout de l'or
    this.db
      .list(`/userProfile/${this.store.value.user.uid}`)
      .update('gold', { gold: this.store.value.user.gold + goldCollected });
    // this.store.value.user.gold +

    // Ajout des arbres
    this.db
      .list(`/userProfile/${this.store.value.user.uid}`)
      .update('plantedTrees', {
        plantedTrees: this.store.value.user.plantedTrees + result.score,
      });

    // Ajout du résultat
    const existingResult = this.getResult(
      this.userBestScores,
      result.difficulty
    );
    if (existingResult.result) {
      // le user a déja un résultat existant
      if (existingResult.result.score >= result.score) {
        // Record non battu
        return;
      }
      // Record battu
      return this.db
        .list(`${result.game}/${this.store.value.user.uid}`)
        .update(existingResult.key, {
          difficulty: result.difficulty,
          score: result.score,
          displayName: this.store.value.user.displayName,
          uid: this.store.value.user.uid
        })
        .then(() => {});
    }
    //New result
    return this.db
      .list(`${result.game}/${this.store.value.user.uid}`)
      .push({
        difficulty: result.difficulty,
        score: result.score,
        displayName: this.store.value.user.displayName,
        uid: this.store.value.user.uid
      })
      .then(() => {});
  }

  /**
   * Enable to get the user result with a specific difficulty with the classic object format from a dataBaseResult.
   * @param resultData resultData refers to this.userResults
   * @param difficulty
   * The returned key is used to update the database
   * Only used externally in the leaderloard -> TODO ?? à mettre ici
   */
  getResult(
    resultData: databaseResult[],
    difficulty: string
  ): { result: databaseResult | undefined; key: string | undefined } {
    // Recherche de l'existence d'un précédent résultat dans la difficulté concernée
    if (!resultData) {
      // Si aucun résultat n'a été enregistré pour le moment
      return { result: undefined, key: undefined };
    }
    // si la difficulté a déja été expérimentée par le user
    for (let key of Object.keys(resultData)) {
      //liste de 3 key-properties (générées aléatoirement par Firebase)
      if (resultData[key].difficulty === difficulty) {
        //une seule possibilité parmis les 3 clés (car un resultat enregistré pour chaque difficulté)
        return { result: resultData[key], key: key };
      }
    }
    // si la difficulté n'a pas encore été expérimentée par le user (pas enregistrée)
    return { result: undefined, key: undefined };
  }

  /**
   * Returns the use rbest store based on the difficulty
   * @param difficulty
   */
  getUserRecord(difficulty: string) {
    return this.getResult(this.userBestScores, difficulty).result.score;
  }

  /**[treeBonus, goldBonus] */
  getUserPercentageBonuses(): [number, number] {
    let percentageTreeBonus = 0;
    let percentageGoldBonus = 0;
    const userItems = this.store.value.user.items;
    Object.keys(userItems).forEach((itemName) => {
      const item = this.SHOP_ITEMS.find((item) => item.itemName === itemName);
      if (item.type === 'classic' && itemName === 'Plant-a-tree') {
        const nbItems = userItems[itemName][itemName]; //Forcement  le classic "arbre"
        percentageTreeBonus += nbItems * item.bonusValue;
      }
      if (item.type === 'classic' && itemName === 'Plant-a-coin') {
        const nbItems = userItems[itemName][itemName]; //Forcement  le classic "coin"
        percentageGoldBonus += nbItems * item.bonusValue;
      }
    });
    return [percentageTreeBonus, percentageGoldBonus];
  }

  // only used inside the constructor
  /**Permet d'actualiser userBestScores */
  private setUserResult(userId: string) {
    //Pour être disponible dans "resultAlreadyExists"
    this.db
      .object<databaseResult[]>(`tree/${userId}`)
      .valueChanges()
      .subscribe((userResults: databaseResult[]) => {
        this.userBestScores = userResults;
      });
  }

  /**Augmente de 1 de nombre de itemName possédés par le joueur */
  buyItem(itemName: string, itemPrice: number) {
    let userItems = this.store.value.user.items;

    //On soustrait le prix de l'item à l'argent du user
    this.db
      .list(`/userProfile/${this.store.value.user.uid}`)
      .update('gold', { gold: this.store.value.user.gold - itemPrice });

    // Si le user a déja des objets dont celui récemment acheté
    if (Object.keys(userItems).find((key) => key === itemName)) {
      let previousNumberOfItems: number = this.store.value.user.items[itemName][
        itemName
      ];
      let itemObj = {};
      itemObj[`${itemName}`] = previousNumberOfItems + 1;
      return this.db
        .list(`/userProfile/${this.store.value.user.uid}/items`)
        .update(`${itemName}`, itemObj)
        .then(() => {});
    }

    // Si le champ "item" n'a pas encore été ajouté aux données user
    //OU si l'objet n'a encore jamais été possédé par le user
    let itemObj2 = {};
    itemObj2[`${itemName}`] = 1;
    return this.db
      .list(`/userProfile/${this.store.value.user.uid}/items`)
      .update(`${itemName}`, itemObj2)
      .then(() => {});
  }

  /**Diminue de 1 de nombre de itemName possédés par le joueur */
  useItem(itemName: string) {
    let userItems = this.store.value.user.items;

    if (Object.keys(userItems).find((key) => key === itemName)) {
      let previousNumberOfItems: number = this.store.value.user.items[itemName][
        itemName
      ];
      let itemObj = {};
      itemObj[`${itemName}`] = previousNumberOfItems - 1; //difference ici avec buyItem
      return this.db
        .list(`/userProfile/${this.store.value.user.uid}/items`)
        .update(`${itemName}`, itemObj)
        .then(() => {});
    }
  }
}
