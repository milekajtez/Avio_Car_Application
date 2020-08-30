import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/start-page-components/home/home.component';
import { InfoComponent } from './components/start-page-components/info/info.component';
import { RegistrationConfirmComponent } from './components/start-page-components/registration-confirm/registration-confirm.component';
import { MainMenuComponent } from './components/main-admin-components/main-menu/main-menu.component';
import { RegularMenuComponent } from './components/regular-user-components/regular-menu/regular-menu.component';
import { AirlineRegistrationComponent } from './components/main-admin-components/airline-registration/airline-registration.component';
import { RentACarRegistrationComponent } from './components/main-admin-components/rent-a-car-registration/rent-a-car-registration.component';
import { AdministratorsRegistrationComponent } from './components/main-admin-components/administrators-registration/administrators-registration.component';
import { DiscountSettingsComponent } from './components/main-admin-components/discount-settings/discount-settings.component';
import { AvioMenuComponent } from './components/avio-admin-components/avio-menu/avio-menu.component';
import { CarMenuComponent } from './components/car-admin-components/car-menu/car-menu.component';
import { AddDestinationComponent } from './components/avio-admin-components/add-destination/add-destination.component';
import { AddFlightComponent } from './components/avio-admin-components/add-flight/add-flight.component';
import { ViewAirlinesComponent } from './components/avio-admin-components/view-airlines/view-airlines.component';
import { AvioProfileComponent } from './components/avio-admin-components/avio-profile/avio-profile.component';
import { ReservationFlightYesComponent } from './components/regular-user-components/reservation-flight-yes/reservation-flight-yes.component';
import { ReservationFlightNoComponent } from './components/regular-user-components/reservation-flight-no/reservation-flight-no.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "info",
    component: InfoComponent
  },
  {
    path: "registrationConfirm",
    component: RegistrationConfirmComponent
  },
  {
    path: "mainAdminHomePage/:UserName",
    component: MainMenuComponent
  },
  {
    path: "regularUserHomePage/:UserName",
    component: RegularMenuComponent
  },
  {
    path: "avioAdminHomePage/:UserName",
    component: AvioMenuComponent
  },
  {
    path: "carAdminHomePage/:UserName",
    component: CarMenuComponent
  },
  {
    path: "reservationFlightYES/:TicketID",
    component: ReservationFlightYesComponent
  },
  {
    path: "reservationFlightNO/:TicketID",
    component: ReservationFlightNoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
