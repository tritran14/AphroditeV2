import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root',
})
export class HermesApiService {
    private HERMES_URL: string;
    private OPTIONS = {
        headers: this.getDefaultHeaders(),
    };
    private getDefaultHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set(
            'Content-Type',
            'application/json; charset=utf-8'
        );
        return headers;
    }

    public pattern(path: string) {
        return `${this.HERMES_URL}/${path}`;
    }

    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService
    ) {
        this.HERMES_URL = this.configService.HERMES_URL;
    }

    public get(
        path: string,
        params: HttpParams = new HttpParams()
    ): Observable<any> {
        return this.httpClient.get(this.pattern(path), {
            ...this.OPTIONS,
            ...params,
        });
    }

    public post(
        path: string,
        body: object | string = {},
        options: object = {}
    ): Observable<any> {
        options = { ...this.OPTIONS, ...options };
        return this.httpClient.post(this.pattern(path), body, options);
    }
}
