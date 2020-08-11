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
    path: "mainAdminHomePage",
    children: [
      { path: "", component: MainMenuComponent },
      { path: "airlineRegistration", component: AirlineRegistrationComponent },
      { path: "rentACarRegistration", component: RentACarRegistrationComponent },
      { path: "administratorsRegistration", component: AdministratorsRegistrationComponent },
      { path: "discountSettings", component: DiscountSettingsComponent }
    ]
  },
  {
    path: "regularUserHomePage",
    component: RegularMenuComponent
  },
  {
    path: "avioAdminHomePage",
    component: AvioMenuComponent
  },
  {
    path: "carAdminHomePage",
    component: CarMenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
