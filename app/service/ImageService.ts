import {Injectable, ElementRef} from "@angular/core";
import {FindemFile} from "../model/FindemFile";
import {Addable} from "../model/Addable";
/**
 * Created by saarlane on 7/10/16.
 */

@Injectable()
export class ImageService {
  constructor() {

  }

  public removeImage(id: number, files: Array<FindemFile>) {
    for (var i = 0; i < files.length; i++) {
      if (files[i].getId() == id) {
        files.splice(i, 1);
      }
    }
  }

  public getPreviousImage(id: number, files: Array<FindemFile>) {
    for (var i = 0; i < files.length; i++) {
      if (files[i].getId() == id) {
        return files[i];
      }
    }
  }

  public saveFile(file: File, object: Addable, i: number) {
    let previous: FindemFile = this.getPreviousImage(i, object.files);

    if (previous) {
      previous.setFile(file);
    } else {
      object.files.push(new FindemFile(i, file));
    }
  }

  public isImage(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
        return true;
    }
    return false;
  }

  private getExtension(filename) {
    let parts = filename.split('.');
    return parts[parts.length - 1];
  }
}
