import {Control} from "@angular/common";
/**
 * Created by saarlane on 7/10/16.
 */

export class ObjectValidator {

  constructor() {

  }

  static isValid(control: Control): ValidationResult {

    if (control.value == "") {
      return {"nameIsEmpty": true};
    }
    return null;
  }
}

interface ValidationResult {
  [key:string]:boolean;
}
