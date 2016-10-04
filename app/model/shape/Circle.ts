import {Point} from "./Point";
import {MapDrawing} from "./MapDrawing";
/**
 * Created by saarlane on 4/10/16.
 */
export class Circle extends MapDrawing {

  private radius: number;
  private center: Point;

  constructor(radius: number, center: Point) {
    super();
    this.radius = radius;
    this.center = center;
  }
}
