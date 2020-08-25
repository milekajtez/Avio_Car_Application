import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AvioCarFrontend';
  
  constructor(private router: Router){}
  
  ngOnInit() {
    if(localStorage.getItem("token") != null){
      const helper = new JwtHelperService();
      if(helper.isTokenExpired(localStorage.getItem("token"))){
        localStorage.removeItem("token");
          this.router.navigateByUrl("/");
          return false;
      }
    }
  }
}
