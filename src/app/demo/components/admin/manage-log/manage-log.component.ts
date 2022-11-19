import { Router } from '@angular/router';
import { AdminService } from './../../../service/admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserLogService } from 'src/app/demo/service/user-log.service';
import { UserLog } from 'src/app/demo/api/UserLog';
import { LogAction } from 'src/app/demo/api/LogAction';
import { HermesResponse } from 'src/app/demo/api/response';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-manage-log',
    templateUrl: './manage-log.component.html',
    styleUrls: ['./manage-log.component.scss'],
})
export class ManageLogComponent implements OnInit {
    public actionLogList: Array<LogAction> = [];
    constructor(private userLogService: UserLogService) {}

    ngOnInit(): void {
        this.userLogService.getAllLogActions().subscribe((data) => {
            console.log(data);
            const res = data as HermesResponse;
            this.actionLogList = res.value as Array<LogAction>;
        });
    }
}
