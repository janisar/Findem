import {Component} from '@angular/core';
import {HomePage} from '../home/home';
import {MapPage} from "../map/map";
import {ProfilePage} from "../profile/profile";

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
  selector: 'findem-home'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = MapPage;
    this.tab3Root = ProfilePage;
  }
}
