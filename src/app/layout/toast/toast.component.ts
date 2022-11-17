import { ToastService, Noti } from './../service/toast.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
    constructor(
        private messageService: MessageService,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.toastService.sub.subscribe((data) => {
            let noti = data as Noti;
            this.messageService.add(noti);
        });
    }

    showError() {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Message Content',
        });
    }

    onConfirm() {
        this.messageService.clear('c');
    }

    onReject() {
        this.messageService.clear('c');
    }

    clear() {
        this.messageService.clear();
    }
}
