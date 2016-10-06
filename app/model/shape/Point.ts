/**
 * Created by saarlane on 4/10/16.
 */
export class Point {

  private lat: number;
  private lng: number;

  constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  getLat() {
    return this.lat;
  }

  getLng() {
    return this.lng;
  }
}
