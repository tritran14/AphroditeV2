import { Observable } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { UserIdentity } from '../api/UserIdenity';
import { AmatApiService } from './amat-api.service';
import { HermesApiService } from './hermes-api.service';
import { LocalService } from './local.service';
import { UserInfo } from '../api/UserInfo';

const route = {
    login: 'login',
    getJWT: 'auth',
    hermesLogin: 'auth',
};

@Injectable({
    providedIn: 'root',
})
export class LoginService implements OnInit {
    private KEY: string = 'userIdentity';
    private currentUser: UserInfo | null = null;
    private isLoggedIn: boolean = false;
    public redirectUrl: string | null = null;
    constructor(
        private localService: LocalService,
        private hermesApiService: HermesApiService,
        private amatApiService: AmatApiService
    ) {}

    ngOnInit(): void {
        
    }

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

    logout(): void {
        this.isLoggedIn = false;
        this.localService.clearData();
    }
}
