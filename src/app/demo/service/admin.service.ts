import { Observable } from 'rxjs';
import { HermesApiAuthService } from './hermes-api-auth.service';
import { Injectable } from '@angular/core';

const route = {
    manageLog: 'admin',
};

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    constructor(private hermesApiService: HermesApiAuthService) {}
    test(): Observable<any> {
        return this.hermesApiService.get(route.manageLog, {
            responseType: 'text',
        });
    }
    
}
