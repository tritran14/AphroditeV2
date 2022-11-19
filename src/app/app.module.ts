import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/demo/service/login.service';
import { WebcamModule } from 'ngx-webcam';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { DropdownModule } from 'primeng/dropdown';
import { ManageLogComponent } from './demo/components/admin/manage-log/manage-log.component';
import { ToastModule } from 'primeng/toast';
import { Interceptor } from './demo/interceptor/interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccessComponent } from './demo/components/access/access.component';

@NgModule({
    declarations: [AppComponent, NotfoundComponent, AccessComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        WebcamModule,
        DropdownModule,
        ButtonModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        LoginService,
        MessageService,
        ToastModule,
        { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
