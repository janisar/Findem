import {Http, Headers, RequestOptions, RequestMethod, Request, Response} from "@angular/http";
import {Injectable, Inject} from "@angular/core";
import {Addable} from "../model/Addable";

import 'rxjs/Rx';
import {Observable} from "rxjs";

@Injectable()
export class AddableService {
  private result: String;

  constructor(@Inject(Http) private http: Http){}

  saveAddable(addable: Addable): Observable<number> {
    let data = JSON.stringify({genericName: addable.genericName, mapDrawings: addable.mapDrawings, description: addable.description, files: addable.files});
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

    return this.http.request(new Request(requestoptions)).map(this.extractObjectId);
  }

  getList(): Observable<Addable[]> {
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');

    return this.http.get("http://localhost:9000/getFindemObjects")
      .map(this.extractListData);
  }

  extractListData(res: Response) {
    let body;

    if (res.json()) {
      body = res.json();
    }
    if (body) {
      return body;
    } else return {};
  }

  extractObjectId(res: Response): number {
    let id;

    if (res.json()) {
      id = parseInt(res.text());
    }
    if (id) {
      return id;
    } else return 0;
  }
}
