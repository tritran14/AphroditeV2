import { Base64 } from './Base64';
export class UserImage {
    public username: string = '';
    public base64List: Array<Base64> = [];
    constructor(username: string, base64List: Array<Base64>) {
        this.username = username;
        this.base64List = base64List;
    }
}
