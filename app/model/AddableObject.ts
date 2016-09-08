import {Addable} from "./Addable";
/**
 * Created by saarlane on 7/09/16.
 */

export class AddableObject extends Addable {
  name;
  description;

  constructor(name, description){
    this.name = name;
    this.description = description;
  }
}
