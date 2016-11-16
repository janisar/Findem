import {Point} from "./Point";
import {MapDrawing} from "./MapDrawing";
import {Map} from "../../pages/map/map";
import {DrawLocationOnMapModal} from "../../pages/add/addOnMap/locationOnMap";
/**
 * Created by saarlane on 4/10/16.
 */
export class Circle extends MapDrawing {

  private radius: number;
  private center: Point;

  constructor(id: number, radius: number, center: Point) {
    super(id, "circle");
    this.radius = radius;
    this.center = center;
  }

  drawShapeOnMap(map, addable, objects) {
    let circle = Map.drawCircle(map, {lat: this.center.getLat(), lng: this.center.getLng()}, this.radius, super.getId());
    objects.push(circle);
    DrawLocationOnMapModal.circleDragListener(circle, addable);
  }

  public updateRadius(radius: number) {
    this.radius = radius;
  }

  public updateCenter(center: Point) {
    this.center = center;
  }
}
