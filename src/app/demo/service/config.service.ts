import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    AMAT_URL = 'http://localhost:5050';
    HERMES_URL = 'http://localhost:8082';
    constructor() {}
}
