import { LocalService } from './local.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { HermesApiService } from './hermes-api.service';

@Injectable({
    providedIn: 'root',
})
export class HermesApiAuthService extends HermesApiService {
    private TOKEN_KEY: string = 'token';
    private AUTHORIZATION: string = 'Authorization';
    private PREFIX_TOKEN: string = 'Bearer ';
    private AUTH_OPTIONS = {
        headers: this.getAuthHeaders(),
    };
    private getAuthHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        let token = this.localService.getData(this.TOKEN_KEY);
        headers = headers.set(
            'Content-Type',
            'application/json; charset=utf-8'
        );
        headers = headers.set(
            this.AUTHORIZATION,
            `${this.PREFIX_TOKEN}${token}`
        );
        return headers;
    }
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        private localService: LocalService
    ) {
        super(httpClient, configService);
    }
    public override get(path: string, options: object = {}): Observable<any> {
        options = { ...this.AUTH_OPTIONS, ...options };
        return super.get(path, options);
    }
}
