import { Base64 } from './Base64';
export class UserImage {
  public id: string = '';
  public base64List: Array<Base64> = [];
  constructor(id: string, base64List: Array<Base64>) {
    this.id = id;
    this.base64List = base64List;
  }
}
