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
  private static counter: number = 0;

  @ViewChild(SaveButton) saveButton: SaveButton;

  ngAfterViewInit(): any {
    let map = Map.getMap(this.mapElement.nativeElement);

    this.drawingManager = Map.getDrawingManager();
    this.drawingManager.setMap(map);
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this.overlayCallback(this.drawingManager));
    google.maps.event.addListener(this.drawingManager, 'polygoncomplete', this.polygonCallback(this.addable));
    google.maps.event.addListener(this.drawingManager, 'circlecomplete', this.circleCallback(this.addable));
    google.maps.event.addListener(this.drawingManager, 'rectanglecomplete', this.rectangleCallback(this.addable));

    if (this.addable.mapDrawings.length > 0) {
      for (var i = 0; i < this.addable.mapDrawings.length; i++) {
        this.addable.mapDrawings[i].drawShapeOnMap(map, this.addable, this.objects);
      }
      this.saveButton.setEnabled(true);
    }
  }

  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
    this.addable = navParams.get("object");
  }

  drawCircle() {
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
    this.saveButton.setEnabled(true);
  }

  undo() {
    if (this.objects.length > 0) {
      let object = this.objects.pop();
      this.addable.mapDrawings.pop();
      if (object.overlay)
        object.overlay.setMap(null);
      else {
        object.setMap(null);
      }
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
      element.id = DrawLocationOnMapModal.counter;
      element.object = element.type;
      console.log(element.type);
      obj.push(element);
      drawingmanager.setDrawingMode(null);
      google.maps.event.addListener(element, "rightclick", function (point) { point.setMap(null) });
      DrawLocationOnMapModal.counter = DrawLocationOnMapModal.counter + 1;
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
      let newPoly = new Polygon(DrawLocationOnMapModal.counter, points);
      addable.mapDrawings.push(newPoly);
    };

  }

  private circleCallback(addable) {
    return function (circle) {
      google.maps.event.addListener(circle, 'radius_changed', function(event) {
        addable.mapDrawings.filter(t => t.id == circle.id).map(t => t.updateRadius(circle.radius));
      });
      google.maps.event.addListener(circle, 'center_changed', function(event) {
        addable.mapDrawings.filter(t => t.id == circle.id).map(t => t.updateCenter(new Point(circle.center.lat(), circle.center.lng())));
      });
      DrawLocationOnMapModal.circleDragListener(circle, addable);
      var center = circle.center;
      var radius = circle.radius;
      circle.id = DrawLocationOnMapModal.counter;

      let newCircle = new Circle(DrawLocationOnMapModal.counter, radius,  new Point(center.lat(), center.lng()));
      addable.mapDrawings.push(newCircle);
    };
  }

  private rectangleCallback(addable) {
    return function (rect) {

      DrawLocationOnMapModal.rectDragListener(rect, addable);
      var left = rect.bounds.b.b;
      var top = rect.bounds.f.b;
      var right = rect.bounds.b.f;
      var bottom = rect.bounds.f.f;
      rect.id = DrawLocationOnMapModal.counter;

      var newRect = new Rect(DrawLocationOnMapModal.counter, left, top, right, bottom);
      addable.mapDrawings.push(newRect);
    };
  }

  static rectDragListener(rect, addable) {
    google.maps.event.addListener(rect, 'bounds_changed', function(event) {
      var bounds = rect.getBounds();
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      addable.mapDrawings.filter(t => t.id == rect.id).map(t => t.updateCoordinates(sw.lng(), ne.lat(), ne.lng(), sw.lat()));
    });
  }

  static circleDragListener(circle, addable) {
    google.maps.event.addListener(circle, 'radius_changed', function(event) {
      addable.mapDrawings.filter(t => t.id == circle.id).map(t => t.updateRadius(circle.radius));
    });
    google.maps.event.addListener(circle, 'center_changed', function(event) {
      addable.mapDrawings.filter(t => t.id == circle.id).map(t => t.updateCenter(new Point(circle.center.lat(), circle.center.lng())));
    });
  }
}
