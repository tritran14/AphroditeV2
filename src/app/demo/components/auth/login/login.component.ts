import { ToastService } from './../../../../layout/service/toast.service';
import { MessageService } from 'primeng/api';
import { UserInfo } from './../../../api/UserInfo';
import { HermesResponse } from './../../../api/response';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { LoginService } from 'src/app/demo/service/login.service';
import { UserIdentity } from 'src/app/demo/api/UserIdenity';
import { JsonConvert } from 'json2typescript';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
            a:link,
            a:visited {
                background-color: white;
                color: black;
                border: 2px solid green;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
            }

            a:hover,
            a:active {
                background-color: green;
                color: white;
            }
            .progress-spinner {
                position: fixed;
                z-index: 999;
                height: 2em;
                width: 2em;
                overflow: show;
                margin: auto;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
            }

            /* Transparent Overlay */
            .progress-spinner:before {
                content: '';
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.53);
            }
        `,
    ],
})
export class LoginComponent implements OnInit {
    valCheck: string[] = ['remember'];
    password!: string;
    username!: string;
    public showWebcam = true;
    public webcamImage: WebcamImage | null = null;
    public imageList: Array<WebcamImage> = [];
    public userIdentity: UserIdentity | null = null;

    private TOTAL_IMAGE: number = 10;
    private DEPLAY_SECOND = 500;

    private trigger: Subject<void> = new Subject<void>();
    private jsonConvert: JsonConvert = new JsonConvert();
    returnUrl: any;
    isLoading: boolean = false;

    constructor(
        private loginService: LoginService,
        public layoutService: LayoutService,
        private router: Router,
        private route: ActivatedRoute,
        private toastService: ToastService
    ) {}

    public handleImage(webcamImage: WebcamImage): void {
        console.info('received webcam image', webcamImage);
        this.webcamImage = webcamImage;
        this.imageList.push(webcamImage);
    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    public triggerSnapshot(): void {
        this.trigger.next();
    }

    ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    startCapture(): void {
        if (!this.username || !this.password) {
            this.toastService.showError('username or password is required');
            return;
        }
        this.imageList = [];
        this.userIdentity = null;
        this.isLoading = true;
        for (let i = 0; i < this.TOTAL_IMAGE; ++i) {
            setTimeout(() => {
                this.triggerSnapshot();
                if (i == this.TOTAL_IMAGE - 1) {
                    this.isLoading = false;
                    this.handleAfterCapture();
                }
            }, this.DEPLAY_SECOND * (i + 1));
        }
    }

    handleAfterCapture(): void {
        console.log(this.imageList);
        let id = 0;
        let base64List = this.imageList.map(
            (webcamImage, id) => new Base64Image(id, webcamImage.imageAsBase64)
        );
        console.log({ base64List });
        this.sendBase64ToServer(base64List);
    }

    sendBase64ToServer(base64List: Array<Base64Image>): void {
        this.loginService.sendBase64ToServer(base64List).subscribe((data) => {
            this.userIdentity = data as UserIdentity;
            // alert(
            //     `name : ${this.userIdentity.name}, username: ${this.username}, password: ${this.password}`
            // );
            this.signIn();
        });
    }

    signIn(): void {
        // this.userIdentity = new UserIdentity();
        this.isLoading = true;
        console.log('log in');
        if (this.userIdentity != null && this.username && this.password) {
            this.loginService
                .sendUserInfoToServer(
                    this.username,
                    this.password,
                    this.userIdentity
                )
                .subscribe(
                    (data) => {
                        let response = data as HermesResponse;
                        console.log({ data });
                        if (response.success) {
                            let jwt = response.value.jwt;
                            this.loginService.setJwt(jwt);
                            this.router.navigateByUrl(this.returnUrl);
                        } else {
                            this.toastService.showError(response.value);
                            // alert('Invalid account, password or face');
                        }
                        this.isLoading = false;
                    },
                    () => {
                        this.isLoading = false;
                    }
                );
        } else {
            this.toastService.showError('require infomation');
            // alert('require infomation');
        }
    }
}

class Base64Image {
    id: number = -1;
    value: string | null = null;
    constructor(id: number, value: string) {
        this.id = id;
        this.value = value;
    }
}
