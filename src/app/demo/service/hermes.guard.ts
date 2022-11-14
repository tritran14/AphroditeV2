import { LoginService } from 'src/app/demo/service/login.service';
import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HermesGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.loginService.isAuthenticated()) return true;
        this.router.navigate(['login'], {
            queryParams: { returnUrl: state.url },
        });
        return false;
    }
}
