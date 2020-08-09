import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RegisterService } from 'src/app/services/register-and-login/register-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { jwt_decode } from 'jwt-decode';

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
        var decoded = jwt_decode(res.token);
        if(decoded === "regular_user")
        {
          this.router.navigateByUrl('/home');
        }
        else if(decoded === "main_admin")
        {
          // komponenta za glavnog admina
        }
        else if(decoded === "avio_admin")
        {
          // komponenta za avio admina
        }
        else if(decoded === "car_admin")
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
