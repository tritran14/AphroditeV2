import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: DashboardComponent },
            {
                path: 'admin',
                loadChildren: () =>
                    import('../../../demo/components/admin/admin.module').then(
                        (m) => m.AdminModule
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DashboardsRoutingModule {}
