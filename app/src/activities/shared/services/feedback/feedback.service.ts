import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Store } from 'src/store';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private db: AngularFireDatabase, private store:Store) { }

  addFeedback(value){
    this.db
    .list(`feedback/${this.store.value.user.displayName}`)
      .push(value) 
      .then(() => {
        return alert("Merci de votre retour !")
      })
  }

}
