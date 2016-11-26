import {NavController, Storage, LocalStorage} from "ionic-angular";
import {Component} from "@angular/core";
import {User} from "../../model/User";
/**
 * Created by saarlane on 3/10/16.
 */

@Component({
  templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage {

  local: Storage;
  public user: User = new User("", "");

  constructor(private navCtrl: NavController) {
    this.local = new Storage(LocalStorage);

    this.local.get("loginUser").then(value => {
      let jsonValue = JSON.parse(value);
      this.user = new User(jsonValue.email, jsonValue.userName);
      this.user.setImg(jsonValue.img);
    });
  }
}
