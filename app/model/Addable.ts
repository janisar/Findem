import {MapDrawing} from "./shape/MapDrawing";
/**
 * Created by saarlane on 2/10/16.
 */
export class Addable {

  genericName: string;
  firstName: string;
  lastName: string;
  location: string;
  description: string;
  files: Array<File> = [];
  mapDrawings: Array<MapDrawing> = [];

  constructor() {

  }
}
