import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {HttpInterceptorsProviders} from "./interceptors";
import {ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
      HttpInterceptorsProviders
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
