/**
 * Created by saarlane on 4/10/16.
 */

export abstract class MapDrawing {

  private id: number;

  abstract drawShapeOnMap(map, addable, objects);

  constructor(id: number) {
    this.id = id;
  }

  getId() {
    return this.id;
  }
}
