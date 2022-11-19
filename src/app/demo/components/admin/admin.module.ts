import { ManageLogComponent } from './manage-log/manage-log.component';
import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    declarations: [ManageLogComponent],
    imports: [CommonModule, TableModule, AdminRoutingModule],
})
export class AdminModule {}
