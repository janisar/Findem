import {MapDrawing} from "./MapDrawing";
/**
 * Created by saarlane on 4/10/16.
 */
export class Rect extends MapDrawing {

  private left: number;
  private top: number;
  private right: number;
  private bottom: number;

  constructor(left: number,
              top: number,
              right: number,
              bottom: number) {
    super();
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }
}
