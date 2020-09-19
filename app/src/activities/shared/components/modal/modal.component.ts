import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  constructor(private el: ElementRef) {}
  ngOnInit() {
    document.getElementById('accept').addEventListener('click', () => {
      this.accept();
    });
    document.getElementById('refuse').addEventListener('click', () => {
      this.refuse();
    });
  }

  //TODO: check action
  accept() {
    this.closeModal();
  }
  refuse() {
    this.closeModal();
  }

  closeModal() {
    this.el.nativeElement.classList.remove('sshow');
    this.el.nativeElement.classList.add('hhidden');
  }
}
