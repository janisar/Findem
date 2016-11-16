import {Http, Headers, RequestOptions, RequestMethod, Request} from "@angular/http";
import {Injectable, Inject} from "@angular/core";
import {Addable} from "../model/Addable";

import 'rxjs/Rx';

@Injectable()
export class AddableService {
  private result: String;

  constructor(@Inject(Http) private http: Http){}

  saveAddable(addable: Addable) {
    let data = JSON.stringify({genericName: addable.genericName, mapDrawings: addable.mapDrawings, description: addable.description, files: []});
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');

    let requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: "http://localhost:9000/saveObject",
      headers: headers,
      body: data
    });

    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });

    this.http.request(new Request(requestoptions)).map(res => res.json()).subscribe(data => this.result = data, err => console.log(err), () => console.log("result" + this.result))
  }
}
