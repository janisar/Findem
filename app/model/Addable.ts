import {List} from "ionic-angular";
/**
 * Created by saarlane on 2/10/16.
 */
export class Addable {

  genericName: string;
  firstName: string;
  lastName: string;
  location: string;
  description: string;
  files: Array<File> = [];

  constructor() {

  }
}
