import {Component, AfterViewInit, ViewChildren, QueryList, ElementRef, Renderer, ViewChild} from "@angular/core";
import {ViewController} from "ionic-angular";
import {Addable} from "../../model/Addable";
import {Location} from "../../model/Location";

declare var google;

@Component({
  selector: 'findem-add',
  templateUrl: './build/pages/add/add.html'
})

export class AddModalContentPage implements AfterViewInit {
  ngAfterViewInit(): any {
    this.initAutocomplete();
  }

  @ViewChildren('fileInput') imageComponents: QueryList<ElementRef>;
  @ViewChildren('files') files: QueryList<ElementRef>;
  @ViewChild('autocomplete') autoComplete: any;

  private type = 0;
  private imageToAdd = 0;
  public object: Addable = new Addable();

  constructor(
    public element: ElementRef,
    public viewCtrl: ViewController,
    private renderer:Renderer
  ) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  public insertImage(result) {
    this.imageToAdd = result.image;
    let event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(
      this.files.toArray()[this.imageToAdd-1].nativeElement, 'dispatchEvent', [event]);
  }

  public uploadImage(event) {
    var file = event.target.files[0];
    this.object.files.push(file);

    var reader = new FileReader();
    var elementWrapper = this.imageComponents.toArray()[this.imageToAdd - 1];

    reader.onload = function (e: FileReaderEvent) {
      elementWrapper.nativeElement.style.background = "url('" + e.target.result + "')";
      elementWrapper.nativeElement.style.backgroundSize = "cover";
    };
    reader.readAsDataURL(file);
  }
  public updateType(result) {
    this.type = result.type;
  }

  addObject() {
    console.log(this.object);
  }

  private autocomplete: any;
  private componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  private initAutocomplete() {
    let el: HTMLInputElement = <HTMLInputElement>document.getElementsByClassName("autocomplete")[0];
    this.autocomplete = new google.maps.places.Autocomplete(
      (el.firstChild.nextSibling),
      {types: ['geocode']});

    this.autocomplete.addListener('place_changed', this.fillInAddress(this.autocomplete, this.componentForm, this.object));
  }

  private fillInAddress(autocomplete, componentForm, object) {
    return function() {
      var place = autocomplete.getPlace();

      let location: Location = new Location();

      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          switch (addressType) {
            case "locality":
              location.setLocality(val);
              break;
            case "administrative_area_level_1":
              location.setAdministrativeArea(val);
              break;
            case "country":
              location.setCountry(val);
              break;
            case "route":
              location.setRoute(val);
              break;
            case "postal_code":
              location.setPostalCode(val);
              break;
            default:
              console.log("not found: " + addressType);
              break;
          }
        }
      }
      object.location = location;
    };
  }

  geolocate() {
    var ac = this.autocomplete;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        ac.setBounds(circle.getBounds());
      });
    }
  }
}

interface FileReaderEventTarget extends EventTarget {
  result:string
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}
