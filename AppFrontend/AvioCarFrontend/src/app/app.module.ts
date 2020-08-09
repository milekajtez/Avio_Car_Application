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
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { RegistrationConfirmComponent } from './components/start-page-components/registration-confirm/registration-confirm.component';
import { HomePageComponent } from './components/home-page-components/home-page/home-page.component';
import { UserProfileComponent } from './components/home-page-components/user-profile/user-profile.component';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, AuthService } from 'angularx-social-login';

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
