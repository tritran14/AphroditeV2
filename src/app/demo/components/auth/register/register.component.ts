import { RegisterService } from './../../../service/register.service';
import { UserInfo } from './../../../api/UserInfo';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonConvert } from 'json2typescript';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { HermesResponse } from 'src/app/demo/api/response';
import { UserIdentity } from 'src/app/demo/api/UserIdenity';
import { LoginService } from 'src/app/demo/service/login.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Base64 } from 'src/app/demo/api/Base64';
import { UserImage } from 'src/app/demo/api/UserImage';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
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
export class RegisterComponent implements OnInit {
    userInfo: UserInfo = {
        username: null,
        firstName: null,
        lastName: null,
        email: null,
        roles: [],
    };

    valCheck: string[] = ['remember'];
    password!: string;
    password2!: string;
    username!: string;
    public validImage: Array<Base64> = [];
    public showWebcam = true;
    public webcamImage: WebcamImage | null = null;
    public imageList: Array<WebcamImage> = [];
    public userIdentity: UserIdentity | null = null;

    private TOTAL_NEED_IMAGE: number = 10;
    private TOTAL_IMAGE: number = 10;
    private DEPLAY_SECOND = 500;

    private trigger: Subject<void> = new Subject<void>();
    private jsonConvert: JsonConvert = new JsonConvert();
    returnUrl: any;

    constructor(
        private registerService: RegisterService,
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
        this.username = 'tri123';
    }

    startCapture(): void {
        this.imageList = [];
        this.userIdentity = null;
        this.validImage = [];

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
        this.registerService
            .sendBase64ToServer(base64List)
            .subscribe((data) => {
                if (data) {
                    let validBase64 = data.validImage as Array<Base64>;
                    console.log(data.message);
                    console.log(validBase64);
                    validBase64.forEach((data, id) => {
                        this.validImage.push(
                            new Base64(this.validImage.length, data.value)
                        );
                    });
                    if (this.validImage.length >= this.TOTAL_NEED_IMAGE) {
                        console.log('good number of image');
                        this.uploadFace();
                    }
                }
            });
    }

    uploadFace(): void {
        let userImage = new UserImage(this.username, this.validImage);
        // console.log(userImage);
        this.registerService
            .uploadBase64ToServer(userImage)
            .subscribe((data) => {
                console.log(data);
            });
    }

    isValidUserInfo() {
        return (
            this.userInfo.username &&
            this.userInfo.firstName &&
            this.userInfo.lastName &&
            this.userInfo.email
        );
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
