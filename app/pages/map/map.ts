/**
 * Created by saarlane on 6/09/16.
 */
import {Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {AddableService} from "../../service/AddableService";
import {Addable} from "../../model/Addable";
import {Circle} from "../../model/shape/Circle";
import {PopoverController} from "ionic-angular";
import {ObjectDetails} from "./details/ObjectDetails";
import {Rect} from "../../model/shape/Rect";
//import { AppComponent } from './app.component';

declare var google;

@Component({
  selector: 'map',
  templateUrl: 'build/pages/map/map.html',
  providers: [AddableService]
})

export class MapPage implements AfterViewInit {

  @ViewChild('findemMap') mapElement: ElementRef;
  private map: any;

  ngAfterViewInit(): any {
    this.map = Map.getMap(this.mapElement.nativeElement);

    this.addableService.getList().subscribe(response =>
        this.drawObjectsOnMap(response),
      error => {
        console.log(error)
      });
  }

  constructor(
    private addableService: AddableService,
    private popoverCtrl: PopoverController
  ) {  }

  drawObjectsOnMap(findemObjects: Addable[]) {
    findemObjects.forEach(object => {

      object.mapDrawings.forEach(mapDrawing => {
        let type: string = mapDrawing.type;
        let id = mapDrawing.id;

        var popoverController = this.popoverCtrl;
        var findemObject = object;

        if (type === "circle") {
          let circle: Circle = <Circle> mapDrawing;
          let mapCircle = Map.drawCircle(this.map, {lat: circle.center.lat, lng: circle.center.lng}, circle.radius, id, false);

          google.maps.event.addListener(mapCircle, 'click', function() {
            popoverController.create(ObjectDetails, {"object": findemObject}).present();
          });

        } else if (type === "rect") {
          let rect: Rect = <Rect> mapDrawing;
          let bounds = {
            north: rect.top,
            south: rect.bottom,
            east: rect.right,
            west: rect.left
          };
          let mapRect = Map.drawRect(this.map, bounds, id, false);
          google.maps.event.addListener(mapRect, 'click', function() {
            popoverController.create(ObjectDetails, {"object": findemObject}).present();
          });
        }
      });
    });
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

  static drawRect(map, bounds, id, isEditable) {
    return new google.maps.Rectangle({
      fillColor: 'rgba(200, 54, 54, 0.2)',
      fillOpacity: 0.6,
      strokeWeight: 1,
      clickable: true,
      editable: isEditable,
      draggable: isEditable,
      zIndex: 1,
      id: id,
      map: map,
      bounds: bounds
    });
  }

  static drawCircle(map, center, radius, id, isEditable) {
    var opacity = 0.2;
    if (!isEditable) {
      opacity = 0.5;
    }
    return  new google.maps.Circle({
      fillColor: 'rgba(200, 54, 54, ' + opacity + ')',
      fillOpacity: 0.6,
      strokeWeight: 1,
      clickable: true,
      editable: isEditable,
      draggable: isEditable,
      zIndex: 1,
      id: id,
      map: map,
      center: center,
      radius: radius
    });
  }

}

