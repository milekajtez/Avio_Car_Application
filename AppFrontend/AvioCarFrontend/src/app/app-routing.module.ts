import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/start-page-components/home/home.component';
import { InfoComponent } from './components/start-page-components/info/info.component';
import { RegistrationConfirmComponent } from './components/start-page-components/registration-confirm/registration-confirm.component';
import { MainMenuComponent } from './components/main-admin-components/main-menu/main-menu.component';
import { RegularMenuComponent } from './components/regular-user-components/regular-menu/regular-menu.component';
import { AvioMenuComponent } from './components/avio-admin-components/avio-menu/avio-menu.component';
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
