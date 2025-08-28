import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule,LOCALE_ID} from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { FakeBackendProvider } from './core/helpers/fake-backend';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { LayoutModule } from './layout/layout.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PathLocationStrategy, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {CommonModule,LocationStrategy,HashLocationStrategy} from '@angular/common';


registerLocaleData(localeFr, 'fr');
@NgModule({
  declarations: [
    AppComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    LayoutModule, BrowserAnimationsModule,ToastrModule.forRoot(),
    CoreModule.forRoot()
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    Title,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // provider used to create fake backend
    FakeBackendProvider,
    { provide: LOCALE_ID, useValue: 'fr' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }