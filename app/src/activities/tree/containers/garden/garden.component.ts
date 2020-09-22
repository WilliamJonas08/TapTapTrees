import { Component, OnInit } from '@angular/core';
import { Store } from 'src/store';
import {
  TreeService,
  shopItem,
} from 'src/activities/shared/services/tree/tree.service';
import { Observable } from 'rxjs';
import { User } from 'src/auth/shared/services/auth.service';

export interface shopItemExtended {
  itemName: string;
  price: number;
  description: string;
  type: string /* classic ou booster */;
  displayName?: string;
}

@Component({
  selector: 'garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.scss'],
})
export class GardenComponent implements OnInit {
  user$: Observable<User>;

  shopItems: Array<shopItemExtended>;
  classicItems: Array<shopItemExtended>;
  boosterItems: Array<shopItemExtended>;

  showModal: boolean = false; //Affichage de la modal
  waitPublicity:boolean =false //Bloquage des boutons pendant la pub

  constructor(private store: Store, private treeService: TreeService) {}

  ngOnInit(): void {
    this.user$ = this.store.select('user');
    this.shopItems = this.treeService.getShopItems();

    const regex = /[-]/g; //désigne un tiret "-"
    this.shopItems.forEach((shopItem) => {
      let displayName: string = shopItem.itemName.replace(regex, ' ');
      shopItem['displayName'] = displayName;
    });

    this.classicItems = this.shopItems.filter(
      (item) => item.type === 'classic'
    );
    this.boosterItems = this.shopItems.filter(
      (item) => item.type === 'booster'
    );
  }

  buyItem(itemName: string) {
    //Récupérations infos item en cours d'achat
    const item = this.treeService
      .getShopItems()
      .find((shopItem) => shopItem.itemName === itemName);
    if (this.store.value.user.gold >= item.price) {
      this.treeService.buyItem(itemName, item.price);
      //On n'affiche la pub que dans le cas d'un achat d'item classique
      if (item.type === 'classic') {
        this.showModal = true;
        this.waitPublicity=true
        // if(window.innerWidth > 567){
          // this.startIgraalScript_computer();
          // }
          this.startIgraalScript_Phone();
          setTimeout(()=>{
            this.waitPublicity=false
          },5000)
      }
    }
  }

  modalAnswer(answer: string) {
    this.showModal = false;
  }

  // startIgraalScript_computer() {
  //   var IGSponso_CrxEIZs8qgKEtRZt = {
  //     igGodfather: 'AG_56dc312713420',
  //     init: function () {
  //       var self = this;
  //       self.igUrl =
  //         self.igJsHost +
  //         '//fr.igraal.com/parrainage/js/ig.js' +
  //         '?f=' +
  //         self.igFormat +
  //         '&l=' +
  //         self.igLinks +
  //         '&g=' +
  //         self.igGodfather +
  //         '&b=' +
  //         self.igBn +
  //         '&s=' +
  //         self.igSize +
  //         '&d=' +
  //         self.igDivId +
  //         '&c=' +
  //         self.igCatId +
  //         '&i=' +
  //         self.igUid +
  //         '&h=' +
  //         self.igDomain +
  //         '&r=' +
  //         self.igRand;
  //       self.igElem = document.createElement('scr' + 'ipt');

  //       self.igElem.setAttribute('type', 'text/javascr' + 'ipt');
  //       self.igElem.setAttribute('src', self.igUrl);
  //       // let link = document.getElementsByTagName("a")
  //       // link.set ('target','_blank');

  //       // self.igOldEvt = window.onload;
  //       // window.onload = function () {
  //       //   if (self.igOldEvt)
  //       // self.igOldEvt();
  //       document.body.appendChild(self.igElem);
  //       // };
  //     },
  //     igUid: 'CrxEIZs8qgKEtRZt',
  //     igLinks: '383',
  //     igFormat: 'img',
  //     igBn: '38',
  //     igSize: 'd0-1o',
  //     igDivId: 'ig-CrxEIZs8qgKEtRZt',
  //     igCatId: 'root',
  //     igDomain: document.domain,
  //     igRand: Math.round(Math.random() * 10000),
  //     igJsHost: 'https:' == document.location.protocol ? 'https:' : 'http:',
  //     igUrl: '',
  //     igElem: null,
  //   };
  //   IGSponso_CrxEIZs8qgKEtRZt.init();
  // }

  startIgraalScript_Phone() {
    var IGSponso_aEHNcBKj598wsUVN = {
      igGodfather: 'AG_56dc312713420',
      init: function () {
        var self = this;
        self.igUrl =
          self.igJsHost +
          '//fr.igraal.com/parrainage/js/ig.js' +
          '?f=' +
          self.igFormat +
          '&l=' +
          self.igLinks +
          '&g=' +
          self.igGodfather +
          '&b=' +
          self.igBn +
          '&s=' +
          self.igSize +
          '&d=' +
          self.igDivId +
          '&c=' +
          self.igCatId +
          '&i=' +
          self.igUid +
          '&h=' +
          self.igDomain +
          '&r=' +
          self.igRand;
        self.igElem = document.createElement('scr' + 'ipt');
        self.igElem.setAttribute('type', 'text/javascr' + 'ipt');
        self.igElem.setAttribute('src', self.igUrl);
        // self.igOldEvt = window.onload;
        // window.onload = function () {
        //   if (self.igOldEvt) self.igOldEvt();
        document.body.appendChild(self.igElem);
        // };
      },
      igUid: 'aEHNcBKj598wsUVN',
      igLinks: '383',
      igFormat: 'img',
      igBn: '37',
      igSize: '8c-6y',
      igDivId: 'ig-aEHNcBKj598wsUVN',
      igCatId: 'root',
      igDomain: document.domain,
      igRand: Math.round(Math.random() * 10000),
      igJsHost: 'https:' == document.location.protocol ? 'https:' : 'http:',
      igUrl: '',
      igElem: null,
    };
    IGSponso_aEHNcBKj598wsUVN.init();
  }
  
  // showDialog() {
  //   let modal_t = document.getElementById('publicity_modal');
  //   modal_t.classList.remove('hhidden');
  //   modal_t.classList.add('sshow');
  // }
}
