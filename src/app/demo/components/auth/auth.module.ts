import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { InputTextModule } from 'primeng/inputtext';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { WebcamModule } from 'ngx-webcam';
import { RegisterComponent } from './register/register.component';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        WebcamModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        AppLayoutModule,
    ],
    declarations: [RegisterComponent],
})
export class AuthModule {}
