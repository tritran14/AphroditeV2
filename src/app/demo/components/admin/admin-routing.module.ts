import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageLogComponent } from './manage-log/manage-log.component';

const routes: Routes = [
    {
        path: '',
        component: ManageLogComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
