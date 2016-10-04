import {Point} from "./Point";
import {MapDrawing} from "./MapDrawing";
/**
 * Created by saarlane on 4/10/16.
 */
export class Polygon extends MapDrawing {

  private points: Array<Point>;
  constructor(points: Array<Point>) {
    super();
    this.points = points;
  }
}
