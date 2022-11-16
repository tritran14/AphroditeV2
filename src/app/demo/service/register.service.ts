import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AmatApiService } from './amat-api.service';
import { HermesApiService } from './hermes-api.service';

const route = {
    register: 'register',
    upload_face: 'upload-face',
};

@Injectable({
    providedIn: 'root',
})
export class RegisterService implements OnInit {
    constructor(
        private hermesApiService: HermesApiService,
        private amatApiService: AmatApiService
    ) {}

    ngOnInit(): void {}

    sendBase64ToRegister(base64List: Array<Object>): void {
        this.amatApiService
            .post(route.register, base64List)
            .subscribe((data) => {
                console.log({ data });
                alert(data.message);
            });
    }
    sendBase64ToServer(base64List: Array<Object>): Observable<any> {
        return this.amatApiService.post(route.register, base64List);
    }

    uploadBase64ToServer(base64List: Object): Observable<any> {
        return this.amatApiService.post(route.upload_face, base64List);
    }
}
