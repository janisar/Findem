import {Component, OnInit, Input} from "@angular/core";
/**
 * Created by saarlane on 17/11/16.
 */

declare const FB: any;

@Component({
  templateUrl: 'build/pages/auth/auth.html',
  selector: 'auth-page'
})
export class Auth implements OnInit {

  @Input() authenticated: boolean;

  token: any;

  constructor() {  }

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

      this.authenticated = true;
    });
  }

  facebook() {
    console.log(this.authenticated);
    FB.init({
      appId      : '933824743416655',
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.8' // use graph api version 2.5
    });
    FB.getLoginStatus(response => {
      this.statusChangeCallback(response);
    });
  }

  ngOnInit() {
  }
}
