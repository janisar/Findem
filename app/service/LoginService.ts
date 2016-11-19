
import {Injectable, Inject} from "@angular/core";
import {Http, Headers, RequestMethod, RequestOptions, Request, Response} from "@angular/http";
import {User} from "../model/User";
import {Observable} from "rxjs";

@Injectable()
export class LoginService {

  constructor(@Inject(Http) private http: Http) {

  }

  tryLogin(user: User): Observable<String> {
    let data = JSON.stringify(user);

    let headers = new Headers({'Content-Type': 'application/json'});
    let requestOptions = new RequestOptions({ headers: headers });

    return this.http.post("http://localhost:9000/login", data, requestOptions).map(this.extractData);
  }

  tryRegister(user: User): Observable<String> {
    let data = JSON.stringify(user);
    let headers = new Headers({'Content-Type': 'application/json'});
    let requestOptions = new RequestOptions({headers: headers});

    return this.http.post("http://localhost:9000/register", data, requestOptions)
      .map(this.extractData);
  }

  private extractData(res: Response) {
    let body;

    // check if empty, before call json
    if (res.text()) {
      body = res.json();
    }

    return body || {};
  }
}
