
import {Injectable, Inject} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {User} from "../model/User";
import {Observable} from "rxjs";

@Injectable()
export class LoginService {

  constructor(@Inject(Http) private http: Http) {

  }

  tryLogin(user: User): Observable<User> {
    let data = JSON.stringify(user);

    let headers = new Headers({'Content-Type': 'application/json'});
    let requestOptions = new RequestOptions({ headers: headers });

    return this.http.post("http://localhost:9000/login", data, requestOptions).map(this.extractUserData);
  }

  tryRegister(user: User): Observable<string> {
    let data = JSON.stringify(user);
    let headers = new Headers({'Content-Type': 'application/json'});
    let requestOptions = new RequestOptions({headers: headers});

    return this.http.post("http://localhost:9000/register", data, requestOptions)
      .map(this.extractData);
  }

  loginOrCreateUser(user: User): Observable<string> {
    return this.http.post("http://localhost:9000/loginOrRegister", JSON.stringify(user)).map(this.extractData)
  }

  private extractData(res: Response): string {
    let body;
    // check if empty, before call json
    if (res.text()) {
      body = res.text();
    }
    return body || "";
  }

  private extractUserData(res: Response): User {
    let body;

    if (res.json()) {
      body = res.json();
    }
    if (body) {
      return new User(body.email, body.userName);
    } else return null;
  }
}
