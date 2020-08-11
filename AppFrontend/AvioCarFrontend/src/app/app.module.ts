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
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { AirlineRegistrationComponent } from './components/main-admin-components/airline-registration/airline-registration.component';
import { RentACarRegistrationComponent } from './components/main-admin-components/rent-a-car-registration/rent-a-car-registration.component';
import { MainMenuComponent } from './components/main-admin-components/main-menu/main-menu.component';
import { AdministratorsRegistrationComponent } from './components/main-admin-components/administrators-registration/administrators-registration.component';
import { DiscountSettingsComponent } from './components/main-admin-components/discount-settings/discount-settings.component';
import { RegularMenuComponent } from './components/regular-user-components/regular-menu/regular-menu.component';
import { AvioMenuComponent } from './components/avio-admin-components/avio-menu/avio-menu.component';
import { CarMenuComponent } from './components/car-admin-components/car-menu/car-menu.component';

let config = new AuthServiceConfig([
  {
     id: GoogleLoginProvider.PROVIDER_ID,
     provider: new GoogleLoginProvider("204173179640-u087p5rhifds30i6u1nt21kragpe893b.apps.googleusercontent.com")
  }
]);
export function provideConfig()
 {
    return config;
 }

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    InfoComponent,
    RegisterComponent,
    RegistrationConfirmComponent,
    AirlineRegistrationComponent,
    RentACarRegistrationComponent,
    MainMenuComponent,
    AdministratorsRegistrationComponent,
    DiscountSettingsComponent,
    RegularMenuComponent,
    AvioMenuComponent,
    CarMenuComponent,
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
    SocialLoginModule.initialize(config)
  ],
  providers: [
   {
     provide: AuthServiceConfig,
     useFactory: provideConfig
   }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
