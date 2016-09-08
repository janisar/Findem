import {Addable} from "./Addable";
/**
 * Created by saarlane on 7/09/16.
 */

export class AddablePerson extends Addable {
  firstName;
  lastName;
  age;
  description;

  constructor(firstName, lastName, age, description) {
    super();

    this.lastName = lastName;
    this.firstName = firstName;
    this.age = age;
    this.description = description;
  }
}
