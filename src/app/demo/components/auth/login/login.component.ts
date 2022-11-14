import { UserInfo } from './../../../api/UserInfo';
import { HermesResponse } from './../../../api/response';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { LoginService } from 'src/app/demo/service/login.service';
import { UserIdentity } from 'src/app/demo/api/UserIdenity';
import { JsonConvert } from 'json2typescript';

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

    constructor(
        private loginService: LoginService,
        public layoutService: LayoutService
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

    ngOnInit(): void {}

    startCapture(): void {
        this.imageList = [];
        for (let i = 0; i < this.TOTAL_IMAGE; ++i) {
            setTimeout(() => {
                this.triggerSnapshot();
                if (i == this.TOTAL_IMAGE - 1) {
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
            alert(
                `name : ${this.userIdentity.name}, username: ${this.username}, password: ${this.password}`
            );
        });
    }
    signIn(): void {
        this.userIdentity = new UserIdentity();
        console.log('log in');
        if (this.userIdentity != null && this.username && this.password) {
            this.loginService
                .sendUserInfoToServer(
                    this.username,
                    this.password,
                    this.userIdentity
                )
                .subscribe((data) => {
                    let response = data as HermesResponse;

                    console.log({ data });

                    if (response.success) {
                        let jwt = response.value.jwt;
                        console.log('jwt : ' + jwt);
                        let userInfoObj = this.parseJWT(jwt);
                        let userInfo = this.jsonConvert.deserializeObject(
                            userInfoObj,
                            UserInfo
                        );
                        console.log(userInfo);
                        localStorage.setItem('JWT', jwt);
                    } else {
                        alert('Invalid account, password or face');
                    }
                });
        } else {
            alert('require infomation');
        }
    }

    parseJWT(token: string): any {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(function (c) {
                    return (
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
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
