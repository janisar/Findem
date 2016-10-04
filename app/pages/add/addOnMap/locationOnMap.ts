import {Component, AfterViewInit, ViewChild, ElementRef} from "@angular/core";
import {Map} from "../../map/map";
import {Rect} from "../../../model/shape/Rect";
import {Circle} from "../../../model/shape/Circle";
import {Point} from "../../../model/shape/Point";
import {Polygon} from "../../../model/shape/Polygon";
import {Addable} from "../../../model/Addable";
import {NavParams, ViewController} from "ionic-angular";
/**
 * Created by saarlane on 4/10/16.
 */

declare var google;


@Component({
  selector: 'save-button',
  template: '<button #button *ngIf="enabled">Save changes</button>'
})
export class SaveButton {
  @ViewChild('button') button: ElementRef;

  enabled:boolean = false;

  constructor() {}

  setEnabled(disabled: boolean) {
    this.enabled = disabled;
  }
}


@Component({
  selector: 'findem-add',
  templateUrl: './build/pages/add/addOnMap/locationOnMap.html',
  directives: [SaveButton]
})
export class DrawLocationOnMapModal implements AfterViewInit {

  @ViewChild('locationOnMap') mapElement: ElementRef;

  private objects = [];
  private drawingManager;
  private addable: Addable;

  @ViewChild(SaveButton) saveButton: SaveButton;

  ngAfterViewInit(): any {
    let map = Map.getMap(this.mapElement.nativeElement);

    this.drawingManager = Map.getDrawingManager();
    this.drawingManager.setMap(map);
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this.overlayCallback(this.drawingManager));
    google.maps.event.addListener(this.drawingManager, 'polygoncomplete', this.polygonCallback(this.addable));
    google.maps.event.addListener(this.drawingManager, 'circlecomplete', this.circleCallback(this.addable));
    google.maps.event.addListener(this.drawingManager, 'rectanglecomplete', this.rectangleCallback(this.addable));
  }

  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
    this.addable = navParams.get("object");
    console.log(this.addable);
  }

  drawCircle() {
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
    this.saveButton.setEnabled(true);
  }

  undo() {
    if (this.objects.length > 0) {
      let overlay = this.objects.pop().overlay;
      overlay.setMap(null);
      if (this.objects.length <= 0) {
        this.saveButton.setEnabled(false);
      }
    }
  }

  draw() {
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    this.saveButton.setEnabled(true);
  }

  drawRect() {
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
    this.saveButton.setEnabled(true);
  }

  save() {
    this.viewCtrl.dismiss();
  }

  private overlayCallback(drawingmanager) {
    var obj = this.objects;
    return function(element) {
      obj.push(element);
      drawingmanager.setDrawingMode(null);
    }
  }

  private polygonCallback(addable) {
    return function (shape) {
      var points = [];

      for (var i = 0; i < shape.getPath().getArray(); i++) {
        var lat = shape.getPath().getArray()[i].lat();
        var lng = shape.getPath().getArray()[i].lng();
        points.push(new Point(lat, lng));
      }
      let newPoly = new Polygon(points);
      addable.mapDrawings.push(newPoly);
    };

  }

  private circleCallback(addable) {
    return function (circle) {
      var center = circle.center;
      var radius = circle.radius;

      let newCircle = new Circle(radius,  new Point(center.lat(), center.lng()));
      addable.mapDrawings.push(newCircle);
    };
  }

  private rectangleCallback(addable) {

    return function (rect) {
      var left = rect.bounds.b.b;
      var top = rect.bounds.f.b;
      var right = rect.bounds.b.f;
      var bottom = rect.bounds.f.f;

      var newRect = new Rect(left, top, right, bottom);
      addable.mapDrawings.push(newRect);
    };
  }
}
