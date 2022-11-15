import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { HermesApiService } from './hermes-api.service';

@Injectable({
    providedIn: 'root',
})
export class HermesApiAuthService extends HermesApiService {
    private AUTH_OPTIONS = {
        headers: this.getAuthHeaders(),
    };
    private getAuthHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set(
            'Content-Type',
            'application/json; charset=utf-8'
        );
        return headers;
    }
    constructor(httpClient: HttpClient, configService: ConfigService) {
        super(httpClient, configService);
    }
    public override get(path: string, options: object = {}): Observable<any> {
        return super.get(path, options);
    }
}
