import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
/**
 * Created by saarlane on 23/11/16.
 */

@Component({
  templateUrl: 'build/pages/map/details/ObjectDetails.html',
  selector: 'map-popup'
})
export class ObjectDetails {

  object: any;

  constructor(private navParams: NavParams) {
    this.object = navParams.get("object");
  }
}
