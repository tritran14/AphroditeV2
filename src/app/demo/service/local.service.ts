import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalService {
    constructor() {}

    public saveData(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public getData(key: string): any {
        let val = localStorage.getItem(key);
        if (val == null || val == undefined) return null;
        return JSON.parse(val);
    }

    public removeData(key: string): void {
        localStorage.removeItem(key);
    }

    public clearData(): void {
        localStorage.clear();
    }
}
