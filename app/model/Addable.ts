import {MapDrawing} from "./shape/MapDrawing";
import {FindemFile} from "./FindemFile";
import {Control} from "@angular/common";
/**
 * Created by saarlane on 2/10/16.
 */
export class Addable {

  genericName: Control;
  firstName: string;
  lastName: string;
  location: string;
  description: string;
  files: Array<FindemFile> = [];
  mapDrawings: Array<MapDrawing> = [];

  constructor() {

  }
}
