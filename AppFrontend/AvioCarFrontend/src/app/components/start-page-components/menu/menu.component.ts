import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RegisterService } from 'src/app/services/register-and-login/register-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  firstLoginVariable: any
  constructor(public service: RegisterService, private router: Router, private toastr: ToastrService,
    private authService: AuthService) { }

  ngOnInit(): void { }

  onSubmit() {
    this.service.login().subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        //console.log("Ulazzzz");
        // decode token and read role od client
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(res.token);

        if(decodedToken.role === "regular_user") {
          this.router.navigateByUrl('/regularUserHomePage/' + this.service.formLoginModel.value.UserName);
        }
        else if(decodedToken.role === "main_admin") {
          this.router.navigateByUrl('/mainAdminHomePage/' + this.service.formLoginModel.value.UserName);
        }
        else if(decodedToken.role === "avio_admin") {
          if(decodedToken.FirstLogin === "True") {
            var tenure = prompt("This is your first login.Please enter your new password.","");
            if(tenure != null) {

              var body = {
                Id: decodedToken.primarysid,
                Password: tenure
              }
              
              this.service.changePasswordFirstLogin(body).subscribe(
                (res: any) => {
                  if (res.succeeded) {
                    alert("Changing password succesfully.");
                    this.router.navigateByUrl('/avioAdminHomePage/' + this.service.formLoginModel.value.UserName);
                  }
                },
                err => {
                  if(err.error === "Username or password is incorrect or user not confirmed registration with mail") {
                    alert("Username or password is incorrect or user not confirmed registration with mail");
                  }
                }
              );
            }
          }
          else
          {
            this.router.navigateByUrl('/avioAdminHomePage/' + this.service.formLoginModel.value.UserName);
          }
        }
        else if(decodedToken.role === "car_admin") {
          if(decodedToken.FirstLogin === "True") {
            var tenure = prompt("This is your first login.Please enter your new password.","");
            if(tenure != null) {
              console.log(tenure);

              var body = {
                Id: decodedToken.primarysid,
                Password: tenure
              }
              
              this.service.changePasswordFirstLogin(body).subscribe(
                (res: any) => {
                  if (res.succeeded) {
                    alert("Changing password succesfully.");
                    this.router.navigateByUrl('/carAdminHomePage/' + this.service.formLoginModel.value.UserName);
                  }
                },
                err => {
                  if(err.error === "Username or password is incorrect or user not confirmed registration with mail") {
                    alert("Username or password is incorrect or user not confirmed registration with mail");
                  }
                }
              );
            }
          }
          else
          {
            this.router.navigateByUrl('/carAdminHomePage/' + this.service.formLoginModel.value.UserName);
          }
        }
      },
      err => {
        if(err.error.message == "Username is incorrect."){
          alert("Username is incorrect.");
        }
        else if(err.error.message == "Password is incorrect."){
          alert("Password is incorrect.");
        }
        else if(err.error.message == "Please go to your mail accont and confirm you registration."){
          alert("Please go to your mail accont and confirm you registration.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }

  LoginWithGoogle(): void {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.authService.signIn(socialPlatformProvider).then(socialusers => {
      this.service.externalLogin(socialusers).subscribe((res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/regularUserHomePage/' + this.service.formLoginModel.value.UserName);
      });
      console.log(socialusers);
    });
  }
}
