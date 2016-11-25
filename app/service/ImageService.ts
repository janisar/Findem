import {Injectable, ElementRef, Inject} from "@angular/core";
import {FindemFile} from "../model/FindemFile";
import {Addable} from "../model/Addable";
import {Http, Headers, RequestMethod, RequestOptions} from "@angular/http";
/**
 * Created by saarlane on 7/10/16.
 */

@Injectable()
export class ImageService {

  constructor(@Inject(Http) private http: Http) {  }

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

  public sendFileToServer(file: File, id: number) {
    this.uploadFile(file, id);
  }

  uploadFile(file:File, id: number):Promise<string> {
    return new Promise((resolve, reject) => {

      let xhr:XMLHttpRequest = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(<string>JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', "http://localhost:9000/saveFile/" + id, true);

      let formData = new FormData();
      formData.append("file", file, file.name);
      xhr.send(formData);
    });
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
