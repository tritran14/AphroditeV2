import { ToastService } from './../../../layout/service/toast.service';
import { UserInfo } from './../../api/UserInfo';
import { LoginService } from 'src/app/demo/service/login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { map, share, Subject, Subscription, timer } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { HermesApiAuthService } from '../../service/hermes-api-auth.service';
import { UserLogService } from '../../service/user-log.service';
import { UserLog } from '../../api/UserLog';
import { JsonConvert } from 'json2typescript';
import { HermesResponse } from '../../api/response';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    CHECK_IN_IMAGE = 'assets/demo/images/mytime/checkin.png';
    CHECK_OUT_IMAGE = 'assets/demo/images/mytime/checkout.png';
    userInfo: UserInfo | null = null;
    userLog: UserLog | null = null;
    aft: number = 0.0;
    fractionSize: number = 2;

    rxTime = new Date();
    timeSubscription: Subscription | null = null;

    userInfoSub: Subject<UserInfo> = new Subject<UserInfo>();

    jsonConvert: JsonConvert = new JsonConvert();

    constructor(
        private loginService: LoginService,
        private userLogService: UserLogService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.timeSubscription = timer(0, 1000)
            .pipe(
                map(() => new Date()),
                share()
            )
            .subscribe((time) => {
                this.rxTime = time;
            });

        this.subcribeUserInfo();
        console.log(this.loginService.currentUser);
        if (this.loginService.currentUser?.username) {
            this.userInfoSub.next(this.loginService.currentUser);
        }
    }
    
    subcribeUserInfo(): void {
        this.userInfoSub.subscribe({
            next: (val) => {
                this.userInfo = val as UserInfo;
                this.refresh();
            },
        });
    }

    logIcon(): string {
        if (this.isCheckin()) return this.CHECK_IN_IMAGE;
        return this.CHECK_OUT_IMAGE;
    }

    refresh(): void {
        if (this.userInfo?.username) {
            this.userLogService
                .getUserLog(this.userInfo?.username)
                .subscribe((data) => {
                    let response = data as HermesResponse;
                    if (!!response.value) {
                        this.userLog = this.convertToUserLog(response.value);
                    }
                });
            this.userLogService
                .getAFT(this.userInfo?.username)
                .subscribe((data) => {
                    let response = data as HermesResponse;
                    if (!!response.value) {
                        this.aft = response.value;
                    }
                });
        }
    }

    isCheckin(): boolean {
        if (this.userLog && this.userLog.checkInTime) return false;
        return true;
    }

    isCheckedIn(): boolean {
        if (this.userLog && this.userLog.checkInTime) return true;
        return false;
    }

    isCheckedOut(): boolean {
        if (this.isCheckedIn() && this.userLog?.checkOutTime) return true;
        return false;
    }

    private convertToUserLog(obj: any): UserLog {
        return this.jsonConvert.deserializeObject(obj, UserLog);
    }

    onClick(): void {
        console.log(this.isCheckin() ? 'check in' : 'check out');
        if (this.userInfo?.username) {
            this.userLogService
                .logTime(this.userInfo.username)
                .subscribe((data) => {
                    let response = data as HermesResponse;
                    console.log(response);
                    console.log('log time success');
                    this.reloadPage();
                });
        }
    }

    private reloadPage(): void {
        window.location.reload();
    }

    ngOnDestroy() {}
}
