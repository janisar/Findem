import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {AddModalContentPage} from "../add/add";
import {FormPage} from "../mock/mock";

@Component({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {
  greeting = "Hello angular";

  constructor(private modalCtrl: ModalController) {  }

  openAddModal() {

    let modal = this.modalCtrl.create(AddModalContentPage);
    modal.present();
  }
}
