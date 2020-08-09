import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/start-page-components/home/home.component';
import { InfoComponent } from './components/start-page-components/info/info.component';
import { RegistrationConfirmComponent } from './components/start-page-components/registration-confirm/registration-confirm.component';
import { HomePageComponent } from './components/home-page-components/home-page/home-page.component';
import { MainAdminHomePageComponent } from './components/home-page-components/main-admin-home-page/main-admin-home-page.component';


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
    path: "home",
    component: HomePageComponent
  },
  {
    path: "mainAdminHomePage",
    component: MainAdminHomePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
