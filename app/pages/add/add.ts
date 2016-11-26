import {
  Component, AfterViewInit, ViewChildren, QueryList, ElementRef, Renderer, ViewChild
} from "@angular/core";
import {ViewController, ModalController, AlertController, LoadingController} from "ionic-angular";
import {Addable} from "../../model/Addable";
import {Location} from "../../model/Location";
import {DrawLocationOnMapModal} from "./addOnMap/locationOnMap";
import {ImageService} from "../../service/ImageService";
import {ControlGroup, AbstractControl, FormBuilder, Validators, FORM_DIRECTIVES} from "@angular/common";
import {AddableService} from "../../service/AddableService";

declare var google;

@Component({
  selector: 'findem-add',
  templateUrl: './build/pages/add/add.html',
  providers: [ImageService, AddableService],
  directives: [DrawLocationOnMapModal, FORM_DIRECTIVES]
})

export class AddModalContentPage implements AfterViewInit {
  ngAfterViewInit(): any {

  }

  @ViewChildren('fileInput') imageComponents: QueryList<ElementRef>;
  @ViewChildren('files') files: QueryList<ElementRef>;
  @ViewChild('autocomplete') autoComplete: any;

  addForm: ControlGroup;
  personForm: ControlGroup;

  genericName: AbstractControl;
  firstName: AbstractControl;
  lastName: AbstractControl;
  location: AbstractControl;

  private type = 0;
  private imageToAdd = 0;

  public object: Addable = new Addable();
  public imageErrors: Array<string> = new Array<string>(4);

  constructor(
    public element: ElementRef,
    public viewCtrl: ViewController,
    private renderer:Renderer,
    private modalCtrl: ModalController,
    private imageService: ImageService,
    private addableService: AddableService,
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController
  ) {
    this.addForm = fb.group({
      'genericName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'location': ['', Validators.compose([])]
    });
    this.personForm = fb.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(2)])]
    });

    this.genericName = this.addForm.controls['genericName'];
    this.firstName = this.personForm.controls['firstName'];
    this.lastName = this.personForm.controls['lastName'];
    this.location = this.addForm.controls['location'];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  public insertImage(result) {
    if (this.imageService.getPreviousImage(result.image, this.object.files)) {
      return;
    } else {
      this.imageToAdd = result.image;
      let event = new MouseEvent('click', {bubbles: true});
      this.renderer.invokeElementMethod(
        this.files.toArray()[this.imageToAdd].nativeElement, 'dispatchEvent', [event]);
    }
  }

  public uploadImage(event) {
    var file = event.target.files[0];
    var elementWrapper = this.imageComponents.toArray()[this.imageToAdd];

    if (file && this.imageService.isImage(file.name)) {
      this.imageErrors[this.imageToAdd] = "ok";

      var reader = new FileReader();
      var _imageService = this.imageService;
      var _imageToAdd = this.imageToAdd;
      var _object = this.object;

      reader.onload = function (e: FileReaderEvent) {
        var base64File = e.target.result;
        elementWrapper.nativeElement.style.background = "url('" + base64File + "')";
        elementWrapper.nativeElement.style.backgroundSize = "cover";

        _imageService.saveFile(file, _object, _imageToAdd);
      };

      reader.readAsDataURL(file);
    } else {

      this.imageErrors[this.imageToAdd] = "fail";
      elementWrapper.nativeElement.innerHTML += "<div class='error'>Not an image</div>";
    }
  }
  public updateType(result) {
    this.type = result.type;
    this.object.objectType = result.type;
  }

  addObject() {
    var valid = true;

    if (this.object.mapDrawings.length <= 0) {
      this.location.markAsTouched();
      valid = false;
    } else {
      this.location.markAsDirty(true)
    }
    if (!this.addForm.valid && this.type == 0) {
      this.genericName.markAsTouched();
      valid = false;
    } else if (!this.personForm.valid && this.type == 1) {
      this.firstName.markAsTouched();
      this.lastName.markAsTouched();
      valid = false;
    }
    if (valid) {
      let loading = this.loadingCtrl.create({
        content: 'Saving object'
      });
      loading.present();

      let _object = this.object;
      let _imageService = this.imageService;

      this.addableService.saveAddable(this.object).subscribe(
        id => {
          _object.files.forEach(file => {
          _imageService.sendFileToServer(file.getFile(), id).then(onfulfilled => {
            loading.dismiss();
            this.dismiss();
          }, onrejected => {
            loading.dismiss();
            let confirm = this.alertCtrl.create({
              title: 'Something bad happened',
              message: 'We were unable to add your object. Deeply sorry..',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    loading.dismiss();
                    this.dismiss();
                  }
                }
              ]
            });
            confirm.present();
          });
          });
        },
        err => loading.dismiss()
      )
    }
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
    // var ac = this.autocomplete;
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     var geolocation = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //     var circle = new google.maps.Circle({
    //       center: geolocation,
    //       radius: position.coords.accuracy
    //     });
    //     ac.setBounds(circle.getBounds());
    //   });
    // }
  }

  drawOnMap() {
    let modal = this.modalCtrl.create(DrawLocationOnMapModal, {"object": this.object});

    modal.present();
  }

  removeMapDrawings() {
    this.object.mapDrawings = [];
  }

  removeImage(img) {
    let confirm = this.alertCtrl.create({
      title: 'Remove this image?',
      message: 'Do you agree to remove this image from form?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Remove',
          handler: () => {
            this.imageErrors[img] = "";
            this.imageService.removeImage(img, this.object.files);
            var elementWrapper = this.imageComponents.toArray()[this.imageToAdd];
            elementWrapper.nativeElement.style.background = "";
          }
        }
      ]
    });
    confirm.present();
  }
}

interface FileReaderEventTarget extends EventTarget {
  result:string
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}
