import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { fakeBackendProvider } from './core/interceptor/fake-backend';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PageLoaderModule } from './layout/page-loader/page-loader.module';

import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {ToastModule} from "primeng/toast";
import {PaginatorModule} from "primeng/paginator";
import {CalendarModule} from "primeng/calendar";


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgScrollbarModule,
    PageLoaderModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    ToastModule,
    PaginatorModule,
    CalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    LoadingBarRouterModule,
    // core & shared
    CoreModule,
    SharedModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
