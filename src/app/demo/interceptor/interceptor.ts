import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const customReq = request.clone({});
        console.log('interceptor');
        return next.handle(customReq).pipe(
            tap(
                () => {},
                (err: any) => {
                    console.log(err);
                    if (err.status === 403) {
                        console.log('navigate');
                        this.router.navigate(['access-denied']);
                    }
                }
            )
        );
    }
}
