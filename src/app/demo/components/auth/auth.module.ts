import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
    imports: [CommonModule, AuthRoutingModule, WebcamModule],
})
export class AuthModule {}
