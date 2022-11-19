import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule, BrowserAnimationsModule],
    exports: [CommonModule, HttpClientModule, BrowserAnimationsModule],
})
export class SharedModule {}
