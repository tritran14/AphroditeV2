import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLog } from '../api/UserLog';
import { HermesApiAuthService } from './hermes-api-auth.service';

const routes = {
    getUserLog: (username: string) => `user_log?username=${username}`,
    logTime: (username: string) => `user_log?username=${username}`,
    getAFT: (username: string) => `user_log/aft?username=${username}`,
};

@Injectable({
    providedIn: 'root',
})
export class UserLogService {
    constructor(private hermesApiAuthService: HermesApiAuthService) {}

    getUserLog(username: string): Observable<any> {
        return this.hermesApiAuthService.get(routes.getUserLog(username));
    }

    logTime(username: string): Observable<any> {
        return this.hermesApiAuthService.post(routes.getUserLog(username), {});
    }

    getAFT(username: string): Observable<any> {
        return this.hermesApiAuthService.get(routes.getAFT(username));
    }
}
