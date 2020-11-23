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
import { MainMenuComponent } from './components/main-admin-components/main-menu/main-menu.component';
import { AdministratorsRegistrationComponent } from './components/main-admin-components/administrators-registration/administrators-registration.component';
import { DiscountSettingsComponent } from './components/main-admin-components/discount-settings/discount-settings.component';
import { RegularMenuComponent } from './components/regular-user-components/regular-menu/regular-menu.component';
import { AvioMenuComponent } from './components/avio-admin-components/avio-menu/avio-menu.component';
import { AddDestinationComponent } from './components/avio-admin-components/add-destination/add-destination.component';
import { AddFlightComponent } from './components/avio-admin-components/add-flight/add-flight.component';
import { ViewAirlinesComponent } from './components/avio-admin-components/view-airlines/view-airlines.component';
import { AvioProfileComponent } from './components/avio-admin-components/avio-profile/avio-profile.component';
import { SeatConfigurationComponent } from './components/avio-admin-components/seat-configuration/seat-configuration.component';
import { SeatsModifyComponent } from './components/avio-admin-components/seats-modify/seats-modify.component';
import { ReservationHistoryComponent } from './components/regular-user-components/reservation-history/reservation-history.component';
import { FlightReservationComponent } from './components/regular-user-components/flight-reservation/flight-reservation.component';
import { RegularProfileComponent } from './components/regular-user-components/regular-profile/regular-profile.component';
import { FriendshipConfigurationComponent } from './components/regular-user-components/friendship-configuration/friendship-configuration.component';
import { AirlinesComponent } from './components/regular-user-components/airlines/airlines.component';
import { FriendshipViewComponent } from './components/regular-user-components/friendship-view/friendship-view.component';
import { FriendshipSettingsComponent } from './components/regular-user-components/friendship-settings/friendship-settings.component';
import { ReservationFlightYesComponent } from './components/regular-user-components/reservation-flight-yes/reservation-flight-yes.component';
import { ReservationFlightNoComponent } from './components/regular-user-components/reservation-flight-no/reservation-flight-no.component';
import { QuickBookingComponent } from './components/regular-user-components/quick-booking/quick-booking.component';

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
    MainMenuComponent,
    AdministratorsRegistrationComponent,
    DiscountSettingsComponent,
    RegularMenuComponent,
    AvioMenuComponent,
    AddDestinationComponent,
    AddFlightComponent,
    ViewAirlinesComponent,
    AvioProfileComponent,
    SeatConfigurationComponent,
    SeatsModifyComponent,
    ReservationHistoryComponent,
    FlightReservationComponent,
    RegularProfileComponent,
    FriendshipConfigurationComponent,
    AirlinesComponent,
    FriendshipViewComponent,
    FriendshipSettingsComponent,
    ReservationFlightYesComponent,
    ReservationFlightNoComponent,
    QuickBookingComponent,
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
    SocialLoginModule.initialize(config),
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
