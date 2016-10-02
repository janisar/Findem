/**
 * Created by saarlane on 6/09/16.
 */
import {Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
//import { AppComponent } from './app.component';

declare var google;

@Component({
  templateUrl: 'build/pages/map/map.html'
})

export class MapPage implements AfterViewInit {

  @ViewChild('findemMap') mapElement: ElementRef;

  ngAfterViewInit(): any {
    Map.getMap();
  }

  constructor() {
  }
}

export class Map {

  static getMap() {

    var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
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

