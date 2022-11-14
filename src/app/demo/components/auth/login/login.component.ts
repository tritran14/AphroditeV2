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

    constructor(
        private loginService: LoginService,
        public layoutService: LayoutService,
        private router: Router,
        private route: ActivatedRoute
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
                        this.loginService.setJwt(jwt);
                        this.router.navigateByUrl(this.returnUrl);
                    } else {
                        alert('Invalid account, password or face');
                    }
                });
        } else {
            alert('require infomation');
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
