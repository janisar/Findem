/**
 * Created by saarlane on 4/10/16.
 */

export abstract class MapDrawing {

  private id: number;
  private type: string;

  abstract drawShapeOnMap(map, addable, objects);

  constructor(id: number, type: string) {
    this.id = id;
    this.type = type;
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }
}
