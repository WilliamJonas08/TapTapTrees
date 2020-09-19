import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { tap } from 'rxjs/operators';

import { Store } from 'src/store';
import { AngularFireDatabase } from '@angular/fire/database';

export interface User {
  email: string;
  uid: string;
  displayName: string;
  authenticated: boolean;
  gold: number;
  plantedTrees: number;
  /**{itemName:number}[] */
  items: Array<Object>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth$ = this.af.authState.pipe(
    tap((nextValue) => {
      if (!nextValue) {
        //quand le user n'est pas encore connecté
        this.store.set('user', null);
        return;
      }

      // quand user connecté
      const user: User = {
        email: nextValue.email,
        uid: nextValue.uid,
        displayName: undefined, //pour le moment
        authenticated: true,
        gold: undefined,
        plantedTrees: undefined,
        items: [],
      };
      this.store.set('user', user);
      this.initializeStore(nextValue.uid);
    })
  );
  //notified each time the authentication state changes

  constructor(
    private af: AngularFireAuth, //Enable to make requests to firebase
    private store: Store, //to set the user in our store
    private db: AngularFireDatabase
  ) {}

  // Utilisé par les guards
  get authState() {
    return this.af.authState;
  }

  createUser(email: string, password: string, pseudo: string) {
    return this.af
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // On complète la base de donnée avec le Pseudo choisi par l'utilisateur
        // Dommage que ce soit forcément dan sune BDD annexe de celle de "auth"
        this.db.database
          .ref(`/userProfile/${user.user.uid}`)
          .set({ displayName: pseudo, userId: user.user.uid });
        this.db
          .list(`/userProfile/${user.user.uid}`)
          .update('gold', { gold: 0 });
        this.db
          .list(`/userProfile/${user.user.uid}`)
          .update('plantedTrees', { plantedTrees: 0 });
      })
      .catch(function (error) {
        console.log(error);
        throw error;
      });
  }

  loginUser(email: string, password: string) {
    return this.af.signInWithEmailAndPassword(email, password);
  }

  logoutUser() {
    return this.af.signOut();
  }

  // Je crois que cette fonction sert à récupérer le pseudo dans le store car ce dernier n'a pas du être mis à jour dès la connection
/**Mise à jour du store : d'abord pour le pseudo et ensuite pour les items, or etc... */
  private initializeStore(userId: string) {
    this.db
      .list(`/userProfile/${userId}`)
      .valueChanges()
      .subscribe((userData: Object[]) => {
        let {
          authenticated,
          displayName,
          email,
          uid,
          gold,
          plantedTrees,
          items,
        } = this.store.value.user;
        const newDisplayName = userData[0];

        //MIGRATION
        //BDD : manque gold/plantedTree / items (cas des 1ers joueurs sans migration)
        // if (userData.length === 2) {
        //   this.db
        //     .list(`/userProfile/${this.store.value.user.uid}`)
        //     .update('gold', { gold: 0 });
        //   this.db
        //     .list(`/userProfile/${this.store.value.user.uid}`)
        //     .update('plantedTrees', { plantedTrees: 0 });
        //   return this.store.set('user', {
        //     authenticated,
        //     displayName: newDisplayName,
        //     email,
        //     uid,
        //     gold: 0,
        //     plantedTrees: 0,
        //     items: [],
        //   });
        // }
        //
        //BDD : manque items
        // if (userData.length === 4) {
        //   let gold =undefined
        //   let plantedTrees =undefined
        //   let items =undefined
        //   for (let i = 0; i < userData.length; i++) {
        //     if (userData[i]['gold'] !== undefined) {
        //       // console.log(userData[i]['gold'])
        //       gold = userData[i]['gold'];
        //     }
        //     if (userData[i]['plantedTrees'] !== undefined) {
        //       // console.log(userData[i]['plantedTrees'])
        //       plantedTrees = userData[i]['plantedTrees'];
        //     }
        //     if (
        //       typeof userData[i] !== 'string' && //si ce n'est pas l'id ou le pseudo
        //       Object.keys(userData[i]).find(
        //         (key) => key === 'gold' || 'plantedTrees' 
        //       ) === undefined //si ce n'est pas un objet contenant l'or ou les arbres plantés
        //     ) {
        //       items = userData[i];
        //     }
        //   }
          // let gold = userData[1][Object.keys(userData[1])[0]];
          // let gold = userData[1]["gold"];
          // let plantedTrees = userData[2][Object.keys(userData[2])[0]];
          // let plantedTrees = userData[2]["plantedTrees"];

        //   console.log(gold,plantedTrees,items)

        //   return this.store.set('user', {
        //     authenticated,
        //     displayName: newDisplayName,
        //     email,
        //     uid,
        //     gold: gold,
        //     plantedTrees: plantedTrees,
        //     items: [],
        //   });
        // }

        //Définis au dessus lors de l'import du store
        // let gold =undefined
        // let plantedTrees =undefined
        let items2 =undefined

        for (let i = 0; i < userData.length; i++) {
          if (userData[i]['gold'] !== undefined) {
            gold = userData[i]['gold'];
          }
          if (userData[i]['plantedTrees'] !== undefined) {
            plantedTrees = userData[i]['plantedTrees'];
          }
          if (
            typeof userData[i] !== 'string' && //si ce n'est pas l'id ou le pseudo
            userData[i]["gold"] === undefined &&//si ce n'est pas un objet contenant l'or
            userData[i]["plantedTrees"] === undefined//si ce n'est pas un objet contenant les arbres plantés
          ) {
            items2 = userData[i];
          }
        }

        if (gold===undefined){
          gold=0
        }
        if (plantedTrees===undefined){
          plantedTrees=0
        }
        if (items2===undefined){
          items2=[]
        }
        
        // let gold2 = userData[1][Object.keys(userData[1])[0]];
        // let plantedTrees2 = userData[3][Object.keys(userData[3])[0]];

        this.store.set('user', {
          authenticated,
          displayName: newDisplayName,
          email,
          uid,
          gold: gold,
          plantedTrees: plantedTrees,
          items: items2,
          // items: userData[2],
        });
      });
  }
}
