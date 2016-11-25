/**
 * Created by saarlane on 7/10/16.
 */
export class FindemFile {

  private id: number;
  private base64: string;
  private file: File;

  constructor(id: number, file: File) {
    this.id = id;
    this.file = file;
  }

  getId() {
    return this.id;
  }

  getFile() {
    return this.file;
  }

  setFile(file: File) {
    this.file = file;
  }

  setBase64(base64File: string) {
    this.base64 = base64File;
  }

  getBase64() {
    return this.base64;
  }
}
