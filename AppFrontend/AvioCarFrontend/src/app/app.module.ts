import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/start-page-components/menu/menu.component';
import { HomeComponent } from './components/start-page-components/home/home.component';
import { InfoComponent } from './components/start-page-components/info/info.component';
import { RegisterComponent } from './components/start-page-components/register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { RegistrationConfirmComponent } from './components/start-page-components/registration-confirm/registration-confirm.component';
import { HomePageComponent } from './components/home-page-components/home-page/home-page.component';
import { UserProfileComponent } from './components/home-page-components/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    InfoComponent,
    RegisterComponent,
    RegistrationConfirmComponent,
    HomePageComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      progressBar: true
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
