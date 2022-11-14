import { UserInfo } from './../../api/UserInfo';
import { LoginService } from 'src/app/demo/service/login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    CHECK_IN_IMAGE = 'assets/demo/images/mytime/check-in.png';
    CHECK_OUT_IMAGE = 'assets/demo/images/mytime/check-out.png';
    userInfo: UserInfo | null = null;
    constructor(private loginService: LoginService) {}

    ngOnInit() {
        console.log(this.loginService.currentUser);
        if (this.loginService.currentUser?.username)
            this.userInfo = this.loginService.currentUser;
    }

    onClick(): void {}

    ngOnDestroy() {}
}
