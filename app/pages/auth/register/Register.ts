import {Component} from "@angular/core";
import {ViewController, NavParams, LoadingController} from "ionic-angular";
import {LoginService} from "../../../service/LoginService";
import {ControlGroup, FormBuilder, FORM_DIRECTIVES, AbstractControl, Validators} from "@angular/common";
import {GenericValidators} from "../../../validator/GenericValidators";
import {User} from "../../../model/User";
/**
 * Created by saarlane on 18/11/16.
 */

@Component({
  templateUrl: 'build/pages/auth/register/register.html',
  directives: [FORM_DIRECTIVES],
  providers: [LoginService]
})
export class Register {

  private registerForm: ControlGroup;
  private userName: AbstractControl;
  private email: AbstractControl;
  private password1: AbstractControl;
  private password2: AbstractControl;
  user: User = new User("", "");
  private registered: any;

  constructor(private viewCtrl: ViewController,
              private loginService: LoginService,
              private formBuilder: FormBuilder,
              private navParams: NavParams,
              public loadingCtrl: LoadingController) {

    this.registerForm = formBuilder.group({
      'userName': ['', Validators.compose([])],
      'email': ['', Validators.compose([Validators.required, Validators.minLength(7), GenericValidators.mailFormat])],
      'password1': ['', Validators.compose([Validators.required])],
      'password2': ['', Validators.compose([Validators.required])]
    });

    this.userName = this.registerForm.controls['userName'];
    this.email = this.registerForm.controls['email'];
    this.password1 = this.registerForm.controls['password1'];
    this.password2 = this.registerForm.controls['password2'];

    this.registered = this.navParams.get("registered");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  signup() {
    if (this.registerForm.valid && this.password1.value.toString() == this.password2.value.toString()) {

      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();

      this.loginService.tryRegister(this.user).subscribe(result => {
          this.registered.emit({"registered": true});
          this.viewCtrl.dismiss();
          loading.dismiss();
      },
      error => {
        console.log(error);
        console.log("Something bad happened?");
      });
    }
  }
}
