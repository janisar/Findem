import {Component, AfterViewInit, ViewChildren, QueryList, ElementRef, Renderer} from "@angular/core";
import {ViewController} from "ionic-angular";

@Component({
  selector: 'findem-add',
  templateUrl: './build/pages/add/add.html'
})

export class AddModalContentPage implements AfterViewInit {
  ngAfterViewInit(): any {
  }

  @ViewChildren('fileInput') imageComponents: QueryList<ElementRef>;
  @ViewChildren('files') files: QueryList<ElementRef>;

  private type = 0;
  private imageToAdd = 0;

  constructor(
    public element: ElementRef,
    public viewCtrl: ViewController,
    private renderer:Renderer
  ) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  insertImage(result) {
    this.imageToAdd = result.image;
    let event = new MouseEvent('click', {bubbles: true});
    console.log(this.files.toArray());
    this.renderer.invokeElementMethod(
      this.files.toArray()[this.imageToAdd-1].nativeElement, 'dispatchEvent', [event]);
  }

  uploadImage(event) {
    var reader = new FileReader();
    var elementWrapper = this.imageComponents.toArray()[this.imageToAdd - 1];

    reader.onload = function (e: FileReaderEvent) {
      elementWrapper.nativeElement.style.background = "url('" + e.target.result + "')";
    };

    reader.readAsDataURL(event.target.files[0]);
  }
  updateType(result) {
    this.type = result.type;
  }
}

interface FileReaderEventTarget extends EventTarget {
  result:string
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}
