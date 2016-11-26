import {Component} from '@angular/core';
import {ModalController, LocalStorage, Storage} from 'ionic-angular';
import {AddModalContentPage} from "../add/add";

@Component({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {

  local: Storage;
  imageUrl: string;

  constructor(private modalCtrl: ModalController) {
    this.local = new Storage(LocalStorage);

    this.local.get("loginUser").then(value => {
      let jsonValue = JSON.parse(value);
      console.log(jsonValue);
      this.imageUrl = jsonValue.imageUrl;
    });
  }

  openAddModal() {

    let modal = this.modalCtrl.create(AddModalContentPage);
    modal.present();
  }
}
