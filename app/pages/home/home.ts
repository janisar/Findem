import {Component, ViewChild, ElementRef, Renderer} from '@angular/core';
import {ModalController, Platform, NavParams, ViewController} from 'ionic-angular';
import {AddablePerson} from "../../model/AddablePerson";

@Component({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {
  greeting = "Hello angular";

  constructor(private modalCtrl: ModalController) {  }

  openModal(characterNum) {

    let modal = this.modalCtrl.create(ModalsContentPage, characterNum);
    modal.present();
  }
  openAddModal() {

    let modal = this.modalCtrl.create(AddModalContentPage);
    modal.present();
  }
}

@Component({
  templateUrl: './build/pages/map/map.html'
})
class ModalsContentPage {
  character;

  constructor(public platform: Platform,
              public params: NavParams,
              public viewCtrl: ViewController) {
    var characters = [
      {
        name: 'Gollum',
        quote: 'Sneaky little hobbitses!',
        image: 'img/avatar-gollum.jpg',
        items: [
          {title: 'Race', note: 'Hobbit'},
          {title: 'Culture', note: 'River Folk'},
          {title: 'Alter Ego', note: 'Smeagol'}
        ]
      },
      {
        name: 'Frodo',
        quote: 'Go back, Sam! I\'m going to Mordor alone!',
        image: 'img/avatar-frodo.jpg',
        items: [
          {title: 'Race', note: 'Hobbit'},
          {title: 'Culture', note: 'Shire Folk'},
          {title: 'Weapon', note: 'Sting'}
        ]
      },
      {
        name: 'Samwise Gamgee',
        quote: 'What we need is a few good taters.',
        image: 'img/avatar-samwise.jpg',
        items: [
          {title: 'Race', note: 'Hobbit'},
          {title: 'Culture', note: 'Shire Folk'},
          {title: 'Nickname', note: 'Sam'}
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
@Component({
  templateUrl: './build/pages/add/add.html'
})

class AddModalContentPage {

  @ViewChild('fileInput') fileInput:ElementRef;

  private type = 0;
  private el = null;

  constructor(
    public element: ElementRef,
    public viewCtrl: ViewController,
    private render:Renderer
  ) {
    this.el = element;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  clicked() {
    var person = new AddablePerson("Janis", "Ardel", 24, "Nice guy");
    console.log(person);
  }
  insertImage(result) {
    this.render.invokeElementMethod(
      this.fileInput.nativeElement, 'dispatchEvent', [event]);
  }

  updateType(result) {
    this.type = result.type;
  }
}

