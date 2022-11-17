import { Base64 } from './Base64';
import { UserInfoPayload } from './UserInfoPayload';
export class RegisterPayload {
    userInfo: UserInfoPayload | null = null;
    images: Array<Base64> = [];
}
