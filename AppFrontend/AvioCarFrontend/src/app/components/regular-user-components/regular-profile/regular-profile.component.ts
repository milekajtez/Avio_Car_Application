import { Component, OnInit } from '@angular/core';
import { RegularUserService } from 'src/app/services/regular-user/regular-user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared/shared-data.service';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';

@Component({
  selector: 'app-regular-profile',
  templateUrl: './regular-profile.component.html',
  styleUrls: ['./regular-profile.component.css']
})
export class RegularProfileComponent implements OnInit {
  username: string;
  email: string;
  phonenumber: string;
  firstname: string;
  lastname: string;
  city: string;
  numberOfPassport: string;
  points: string;

  constructor(public service: RegularUserService, private toastr: ToastrService, private route: ActivatedRoute,
    private data: SharedDataService, public loadService: LoadDataService) 
  {
    route.params.subscribe(params => {
      this.username = params['UserName'];
    });
  }

  ngOnInit(): void {
    this.initializeRegularUserData();
    this.data.currentMessage.subscribe(message => this.username = message);
  }

  newMessage() {
    this.data.changeMessage(this.username);
  }

  //#region 1 - Metoda za ucitavanje pdoataka odredjenog user-a
  initializeRegularUserData() : void {
    this.loadService.loadAdmin(this.username).subscribe(
      (res: any) => {
        this.username = res.userName;
        this.email = res.email;
        this.phonenumber = res.phoneNumber;
        this.firstname = res.firstName;
        this.lastname = res.lastName;
        this.city = res.city;
        this.numberOfPassport = res.numberOfPassport;
        this.points = res.points;
      },
      err => {
        alert("Loading current regular user is failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za promenu podataka odredjenog user-a
  onSubmit(){
    this.service.changeRegularUserProfile(this.username).subscribe(
      (res: any) => {
        console.log("ssss" + res);
        this.username = res.message;
        this.service.changeRegularUser.reset();
        this.initializeRegularUserData();
        this.newMessage();
        alert("Changing profile data successfully.");
      },
      err => {
        console.log(err);
        if(err.error === "Change unsucessfully. User is not registred."){
          alert("Changing profile data failed. User is not registred.");
        }
        else if(err.error === "Change unsucessfully.You must enter new data in form."){
          alert("Changing profile data failed. You must enter new data in form.");
        }
        else if(err.error === "Change unsucessfully.Please input different username."){
          alert("Changing profile data failed. Please enter different username.");
        }
        else{
          alert("Unknown error");
        }
      }
    );
  }
  //#endregion
  //#region 3 - Metoda za menjanje sifre
  changePassword(){
    this.service.changePassword(this.username).subscribe(
      (res: any) => {
        alert("Changing password successfully.");
        this.service.changeRegularUserPassword.reset();
      },
      err => {
        if(err.error === "Server didn't find the username. Changing password is unsuccessfully."){
          alert("Server didn't find the username. Changing password failed.");
        }
        else if(err.error === "Changing password is unsuccessfully. Please enter correct current password."){
          alert("Changing password failed. Please enter correct current password.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
}
