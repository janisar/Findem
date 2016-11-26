/**
 * Created by saarlane on 3/10/16.
 */

export class User {

  email: string;
  userName: string = "";
  password: string;
  imageUrl: string;

  constructor(email: string, username: string) {
    this.email = email;
    this.userName = username;
  }

  setImg(imageUrl: string) {
    this.imageUrl = imageUrl;
  }
}
