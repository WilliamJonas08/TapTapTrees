import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tree-icon',
  templateUrl: './tree-icon.component.html',
  styleUrls: ['./tree-icon.component.scss']
})
export class TreeIconComponent implements OnInit {

  iconSize: string //Defines the size of one icon
  location = new BehaviorSubject<{ X: string, Y: string }>({ X: '0px', Y: '0px' })
  X: string
  Y: string

  private initialValue: number | null // value returned by the icon when "destroyed"
  value: number | null //Nombre d'abres que représente l'icone

  // TODO : externaliser le choix de la hache hors du composant icone (comme le gold)
  private probabilityToBeAxe: number = 0.15 // 0.1 / 1
  private timeAxeDisparition: number = 1000 //1s  //Mettre 1.5s ?
  iconIsAxe: boolean

  iconIsGold:boolean
  goldValue : number
  iconIsGoldSubject = new BehaviorSubject<boolean>(false)

  display: boolean = true

  @Output()
  touched = new EventEmitter<[number, string]>()

  // si on ajoute une fonctionnalité ou les icones s'autodétruisent
  // délai_restant

  ngOnInit() {
    this.iconSize="100px"
    if(window.innerWidth<567){
      this.iconSize=`${window.innerWidth/6}px`
    }

    this.iconIsGoldSubject.subscribe((isGold)=>{
      this.iconIsGold=isGold
    })

    this.location.subscribe((location) => {
      // On commence par définir si l'icon sera une hache (icon sur lequel le user ne doit pas cliquer)
      this.iconIsAxe = Math.random() <= this.probabilityToBeAxe
      if (this.iconIsAxe) {
        setTimeout(() => {
          this.display = false // duplicate false attribution pour le cacher le plus vite possible (rappellé dans le iconTouched)
          this.value = 1 // 1 permet d'avoir this.value ===0 
          // (on a déja this.initialValue===null donc le score ne sera pas incrémenté)
          this.iconIsAxe = false //Le axeIcon n'a pas encore été touché 
          this.iconTouched()
        }, this.timeAxeDisparition) //L'icone Axe disparait au bout de 1s
      }
      if(this.iconIsGold){
        this.goldValue = 5+Math.floor(Math.random()*6) //Valeur de l'or située entre 5 et 10
        // TODO: Le supprimer au bout de 5s ?
      }
      this.value = (this.iconIsAxe|| this.iconIsGold) ? null : Math.floor(1 + Math.random() * 3)
      this.initialValue = this.value
      this.X = location.X
      this.Y = location.Y
      this.display = true
    })
  }

  iconTouched() {
    this.value--
    if (this.value === 0 || this.iconIsAxe || this.iconIsGold) { //si l'icone a été touché le bon nombre de fois OU si la hache a été touchée
      this.display = false
      const emittedValue= this.iconIsGold ? this.goldValue : this.initialValue
      const iconType = this.iconIsAxe? "axe" : this.iconIsGold ? "gold" : "tree"
      this.touched.emit([emittedValue, iconType])
    }
  }

}
