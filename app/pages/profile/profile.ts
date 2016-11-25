import {NavController} from "ionic-angular";
import {Component} from "@angular/core";
import {User} from "../../model/User";
/**
 * Created by saarlane on 3/10/16.
 */

@Component({
  templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage {

  public user: User = new User("Hello", "World");

  constructor(private navCtrl: NavController) {
  }
}
