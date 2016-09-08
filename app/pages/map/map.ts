/**
 * Created by saarlane on 6/09/16.
 */
import {Component} from '@angular/core';
import {google} from "angular2-google-maps/core/services/google-maps-types";
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppComponent } from './app.component';

@Component({
  templateUrl: 'build/pages/map/map.html'
})
@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_KEY'
    })
  ],
  providers: [],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class MapPage {
  public static elements = [];

  constructor() {
    this.loadMap();
  }

  private loadMap = function() {
    google.maps.event.addDomListener(window, 'load', function() {

      var map = Map.getMap();
      var drawingManager = Map.getDrawingManager();

      google.maps.event.addListener(drawingManager, 'overlaycomplete', GoogleMapUtil.drawingListener);

      drawingManager.setMap(map);
    });
  };
}

export class Map {

  static getMap() {

    var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    navigator.geolocation.getCurrentPosition(function(pos) {
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        title: "My Location"
      });
    });

    return map;
  }

  static getDrawingManager() {
    return new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
      },
      markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
      circleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    });
  }
}

class GoogleMapUtil {

  static drawingListener = function(element) {
      MapPage.elements.push(element);
      element.overlay.addListener('click', function(element) {alert("Hello, I am " +  JSON.stringify(element));});
  }
}
