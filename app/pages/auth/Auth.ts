import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES, AbstractControl} from "@angular/common";
import {LoginService} from "../../service/LoginService";
import {ModalController, LoadingController, LocalStorage, Storage} from "ionic-angular";
import {Register} from "./register/Register";
import {User} from "../../model/User";
import {isUndefined} from "ionic-angular/util/util";
/**
 * Created by saarlane on 17/11/16.
 */

declare const FB: any;
declare const gapi: any;

@Component({
  templateUrl: 'build/pages/auth/auth.html',
  selector: 'auth-page',
  providers: [LoginService],
  directives: [FORM_DIRECTIVES]
})
export class Auth implements OnInit {

  @Input()
  authenticated: boolean;

  @Output()
  authenticationChange = new EventEmitter();

  loginForm: ControlGroup;
  userName: AbstractControl;
  password: AbstractControl;

  token: any;
  user: User = new User("", "");
  invalid: boolean = false;
  errorMessage: string;
  local: Storage;

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
    this.local = new Storage(LocalStorage);

    this.local.get("authenticated").then(value => {
      if (value == "true") {
        this.authenticationChange.emit({authenticated: true})
      }
    });
  }

  statusChangeCallback(response: any) {
    if (response.status === 'connected') {
      this.me();
    } else {
      this.login();
    }
  }

  login() {
    FB.login(function(result) {
      this.token = result;
    }, { scope: 'user_friends' });
  }

  me() {
    //noinspection TypeScriptValidateJSTypes
    FB.api('/me?fields=id,name,gender,picture.width(150).height(150)', function(response) {
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

  onGoogleSuccessCallback(authenticationChange) {

    var auth = this.authenticated;
    var local = this.local;
    var _loginService = this.loginService;

    return function(googleUser) {
      console.log(googleUser.getBasicProfile().getName());
      console.log(googleUser.getBasicProfile().getEmail());

      var user = new User(googleUser.getBasicProfile().getName(), googleUser.getBasicProfile().getEmail());

      _loginService.loginOrCreateUser(user);
      
      authenticationChange.emit({"authenticated": true});
      local.set("authenticated", "true");
    };
  }

  ngOnInit() {
    var buttonWidth = window.innerWidth * 0.8;
    var onSuccess = this.onGoogleSuccessCallback(this.authenticationChange);

    if (!isUndefined(gapi)) {
      gapi.signin2.render('google-signin', {
        'scope': 'profile email',
        'width': buttonWidth,
        'height': 36,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': onSuccess,
        'onfailure': function(error) {
          console.log(error);
        }
      });
    }
  }

  genericLogin() {
    if (this.loginForm.valid) {

      let loading = this.loadingCtrl.create({
        content: 'Logging in...'
      });
      loading.present();

      this.loginService.tryLogin(this.user)
        .subscribe(
          result => {
            loading.dismiss();
            if (result) {
              this.authenticationChange.emit({"authenticated": true});
              this.local.set("authenticated", "true");
            } else {
              this.invalid = true;
              this.errorMessage = result.toString();
            }
          },
          error => {
            loading.dismiss();
            this.errorMessage = "Unable to log you in, please try again";
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
