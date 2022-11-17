import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    sub: Subject<Noti> = new Subject<Noti>();

    constructor() {}

    showSuccess(message: string) {
        this.sub.next({
            severity: 'success',
            summary: 'Success',
            detail: message,
        });
    }

    showInfo(message: string) {
        this.sub.next({
            severity: 'info',
            summary: 'Info',
            detail: message,
        });
    }

    showWarn(message: string) {
        this.sub.next({
            severity: 'warn',
            summary: 'Warn',
            detail: message,
        });
    }

    showError(message: string) {
        this.sub.next({
            severity: 'error',
            summary: 'Error',
            detail: message,
        });
    }
}

export interface Noti {
    severity: string;
    summary: string;
    detail: string;
}
