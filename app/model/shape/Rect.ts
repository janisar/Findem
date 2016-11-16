import {MapDrawing} from "./MapDrawing";
import {Map} from "../../pages/map/map";
import {DrawLocationOnMapModal} from "../../pages/add/addOnMap/locationOnMap";
/**
 * Created by saarlane on 4/10/16.
 */
export class Rect extends MapDrawing {

  private left: number;
  private top: number;
  private right: number;
  private bottom: number;

  constructor(id: number,
              left: number,
              top: number,
              right: number,
              bottom: number) {
    super(id, "rect");
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }

  drawShapeOnMap(map, addable, objects) {
    let bounds = {
      north: this.top,
      south: this.bottom,
      east: this.right,
      west: this.left
    };
    let rect = Map.drawRect(map, bounds, super.getId());
    objects.push(rect);
    DrawLocationOnMapModal.rectDragListener(rect, addable);
  }

  updateCoordinates(left: number, top: number, right: number, bottom: number) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }
}
