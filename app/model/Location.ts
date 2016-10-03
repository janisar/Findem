/**
 * Created by saarlane on 4/10/16.
 */
export class Location {

  private country: string;
  private postalCode: string;
  private locality: string;
  private administrativeArea: string;
  private route: string;

  constructor() {

  }

  setLocality(locality) {
    this.locality = locality;
  }

  setAdministrativeArea(administrativeArea) {
    this.administrativeArea = administrativeArea;
  }

  setCountry(country) {
    this.country = country;
  }

  setRoute(route) {
    this.route = route;
  }

  setPostalCode(postalCode) {
    this.postalCode = postalCode;
  }

  toString() {
    let result: string = "";

    if (this.route) {
      result += this.route + ", ";
    }
    if (this.locality) {
      result += this.locality + ", ";
    }
    if (this.administrativeArea) {
      result += this.administrativeArea + ", ";
    }
    if (this.postalCode) {
      result += this.postalCode + ", ";
    }
    if (this.country) {
      result += this.country;
    }
    return result;
  }
}
