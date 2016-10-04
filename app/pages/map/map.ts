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
    Map.getMap(this.mapElement.nativeElement);
  }

  constructor() {
  }
}

export class Map {

  static getMap(element) {

    var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
      zoomControl: true,
      scaleControl: false
    };

    var map = new google.maps.Map(element, mapOptions);

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
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.NONE,
        drawingModes: []
      },
      markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
      circleOptions: {
        fillColor: 'rgba(200, 54, 54, 0.2)',
        fillOpacity: 0.6,
        strokeWeight: 1,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
      },
      rectangleOptions: {
        fillColor: 'rgba(200, 54, 54, 0.2)',
        fillOpacity: 0.6,
        strokeWeight: 1,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
      },
      polygonOptions: {
        fillColor: 'rgba(200, 54, 54, 0.2)',
        fillOpacity: 0.6,
        strokeWeight: 1,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
      }
    })
  }
}

