/**
 * Created by saarlane on 7/10/16.
 */
export class FindemFile {

  private id: number;
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
}
