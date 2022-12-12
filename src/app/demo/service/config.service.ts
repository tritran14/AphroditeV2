import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    AMAT_URL = 'http://localhost:5050';
    HERMES_URL = 'http://localhost:8082';
    // AMAT_URL = 'https://103.162.20.182:5051';
    // HERMES_URL = 'https://103.162.20.182:8083';
    constructor() {}
}
