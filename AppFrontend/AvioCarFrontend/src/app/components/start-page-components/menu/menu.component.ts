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
  
  constructor(public service: RegisterService, private router: Router, private toastr: ToastrService,
    private authService: AuthService) { }

  ngOnInit(): void { }

  onSubmit() {
    this.service.login().subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);

        // decode token and read role od client
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(res.token);

        if(decodedToken.role === "regular_user")
        {
          this.router.navigateByUrl('/home');
        }
        else if(decodedToken.role === "main_admin")
        {
          this.router.navigateByUrl('/mainAdminHomePage');
        }
        else if(decodedToken.role === "avio_admin")
        {
          // komponenta za avio admina
        }
        else if(decodedToken.role === "car_admin")
        {
          // komponenta za car admina
        }
      },
      err => {
        if (err.status == 400)
          this.toastr.error('Incorrect username or password.', 'Authentication failed.');
        else
          console.log(err);
      }
    );
  }

  LoginWithGoogle(): void {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.authService.signIn(socialPlatformProvider).then(socialusers => {
      this.service.externalLogin(socialusers).subscribe((res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/home');
      });
      console.log(socialusers);
    });
  }
}
