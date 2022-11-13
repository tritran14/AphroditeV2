import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserIdentity } from '../api/UserIdenity';
import { AmatApiService } from './amat-api.service';
import { HermesApiService } from './hermes-api.service';
import { LocalService } from './local.service';

const route = {
    login: 'login',
    getJWT: 'auth',
    hermesLogin: 'auth',
};

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private KEY: string = 'userIdentity';
    constructor(
        private localService: LocalService,
        private hermesApiService: HermesApiService,
        private amatApiService: AmatApiService
    ) {}
    sendBase64ToLogin(base64List: Array<Object>): void {
        this.amatApiService.post(route.login, base64List).subscribe((data) => {
            let userIdentity = data as UserIdentity;
            console.log(userIdentity);
            if (userIdentity.id != '-1') {
                console.log('receive user identity');
                this.localService.saveData(this.KEY, userIdentity);
                this.getJWT(userIdentity);
                alert(userIdentity.name);
            }
        });
    }

    sendBase64ToServer(base64List: Array<Object>): Observable<any> {
        return this.amatApiService.post(route.login, base64List);
    }

    getJWT(userIdentity: UserIdentity): void {
        this.hermesApiService
            .post(route.getJWT, userIdentity)
            .subscribe((data) => {
                console.log({ data });
            });
    }

    sendUserInfoToServer(
        username: string,
        password: string,
        userIdentity: UserIdentity
    ): Observable<any> {
        let payload = {
            username: username,
            password: password,
            userIdentity: JSON.stringify(userIdentity),
        };
        return this.hermesApiService.post(route.hermesLogin, payload);
    }
}
