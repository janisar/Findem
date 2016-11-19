import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES, AbstractControl} from "@angular/common";
import {LoginService} from "../../service/LoginService";
import {ModalController, LoadingController} from "ionic-angular";
import {Register} from "./register/Register";
import {User} from "../../model/User";
/**
 * Created by saarlane on 17/11/16.
 */

declare const FB: any;

@Component({
  templateUrl: 'build/pages/auth/auth.html',
  selector: 'auth-page',
  providers: [LoginService],
  directives: [FORM_DIRECTIVES]
})
export class Auth implements OnInit {

  @Input() authenticated: boolean;
  @Output() authenticationChange = new EventEmitter();

  loginForm: ControlGroup;
  userName: AbstractControl;
  password: AbstractControl;

  token: any;
  user: User = new User();
  invalid: boolean = false;

  constructor(private loginService: LoginService,
              private fb: FormBuilder,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController) {

    this.loginForm = fb.group({
      'userName': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([Validators.required])]
    });
    this.userName = this.loginForm.controls['userName'];
    this.password = this.loginForm.controls['password'];
  }

  statusChangeCallback(response: any) {
    if (response.status === 'connected') {
      console.log('connected');
      this.me();
    } else {
      this.login();
    }
    console.log(response);
  }

  login() {
    FB.login(function(result) {
      this.token = result;
    }, { scope: 'user_friends' });
  }

  me() {
    //noinspection TypeScriptValidateJSTypes
    FB.api('/me?fields=id,name,gender,picture.width(150).height(150)', function(response) {
      console.log(response);
      console.log('Successful login for: ' + response.name);

    });
    this.authenticated = true;
    this.authenticationChange.emit({authenticated: true})
  }

  facebook() {
    console.log(this.authenticated);
    FB.init({
      appId      : '933824743416655',
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.getLoginStatus(response => {
      this.statusChangeCallback(response);
    });
  }

  ngOnInit() {
  }

  genericLogin() {
    if (this.loginForm.valid) {

      let loading = this.loadingCtrl.create({
        content: 'Logging in...'
      });
      loading.present();

      this.loginService.tryLogin(this.user)
        .subscribe(
          () => {
            loading.dismiss();
            this.authenticationChange.emit({"authenticated": true});
          },
          error => {
            loading.dismiss();
            this.invalid = true;

            console.log("Hi mate, am not possible to log you in");
          }
        )
    }
  }

  register() {
    this.modalCtrl.create(Register, {'registered': this.authenticationChange}).present();
  }
}
