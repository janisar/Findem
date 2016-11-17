import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {AuthService} from "./service/AuthService";
import {Auth} from "./pages/auth/Auth";


@Component({
  template: '{{authenticated}} <auth-page *ngIf="!authenticated" [authenticated]="authenticated"></auth-page>' +
            '<findem-home *ngIf="authenticated" [root]="rootPage"></findem-home>',
  directives: [Auth, TabsPage],
  providers: [AuthService]
})
export class FindemApp {

  private rootPage: any;
  private authenticated: boolean = false;

  constructor(private platform: Platform,
              private authService: AuthService) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {

      this.authenticated = authService.isAuthenticated();

      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(FindemApp);
