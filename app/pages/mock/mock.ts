/**
 * Created by saarlane on 15/10/16.
 */
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder,  ControlGroup, Validators, AbstractControl} from '@angular/common';


@Component({
  templateUrl: 'build/pages/mock/mock.html',
  directives: [FORM_DIRECTIVES]
})

export class FormPage {

  authForm: ControlGroup;
  username: AbstractControl;
  password: AbstractControl;

  constructor(private fb: FormBuilder) {
    this.authForm = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });

    this.username = this.authForm.controls['username'];
    this.password = this.authForm.controls['password'];
  }

  onSubmit(value: string): void {
    if(this.authForm.valid) {
      console.log('Submitted value: ', value);
    }
  }
}
