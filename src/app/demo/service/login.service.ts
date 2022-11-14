import { JsonConvert } from 'json2typescript';
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
    private TOKEN_KEY: string = 'token';
    private isLoggedIn: boolean = false;
    private jsonConvert: JsonConvert = new JsonConvert();

    public redirectUrl: string | null = null;
    public currentUser: UserInfo | null = null;
    constructor(
        private localService: LocalService,
        private hermesApiService: HermesApiService,
        private amatApiService: AmatApiService
    ) {
        if (this.isAuthenticated()) {
            var token = this.localService.getData(this.TOKEN_KEY);
            this.currentUser = this.parseJWTToUserInfo(token);
            this.isLoggedIn = true;
        }
    }

    ngOnInit(): void {}

    isAuthenticated(): boolean {
        return !!this.localService.getData(this.TOKEN_KEY);
    }

    setJwt(token: string): void {
        this.localService.saveData(this.TOKEN_KEY, token);
        this.currentUser = this.parseJWTToUserInfo(token);
        this.isLoggedIn = true;
        console.log('set token');
    }

    parseJWTToUserInfo(token: string): UserInfo {
        return this.jsonConvert.deserializeObject(
            this.parseJWT(token),
            UserInfo
        );
    }

    parseJWT(token: string): any {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(function (c) {
                    return (
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
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

    setCurrentUser(userInfo: UserInfo): void {
        this.currentUser = userInfo;
    }

    logout(): void {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.localService.clearData();
        window.location.reload();
    }
}
