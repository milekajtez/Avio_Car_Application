import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared/shared-data.service';

@Component({
  selector: 'app-avio-profile',
  templateUrl: './avio-profile.component.html',
  styleUrls: ['./avio-profile.component.css']
})

@Injectable()
export class AvioProfileComponent implements OnInit {
  username: string;
  email: string;
  phonenumber: string;
  firstname: string;
  lastname: string;
  city: string;

  constructor(public service: LoadDataService, private toastr: ToastrService, private route: ActivatedRoute, 
    private data: SharedDataService) 
  {
    route.params.subscribe(params => {
      this.username = params['UserName'];
    });
   }

  ngOnInit(): void {
    this.initializeAdminData();
    this.data.currentMessage.subscribe(message => this.username = message)
  }

  newMessage() {
    this.data.changeMessage(this.username);
  }

  //#region 1 - Metoda za ucitavanje podataka administratora
  initializeAdminData() : void {
    this.service.loadAdmin(this.username).subscribe(
      (res: any) => {
        this.username = res.userName;
        this.email = res.email;
        this.phonenumber = res.phoneNumber;
        this.firstname = res.firstName;
        this.lastname = res.lastName;
        this.city = res.city;
      },
      err => {
        alert("Loading current avio admin is failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za izmenu podataka administratora
  onSubmit() : void {
    this.service.changeAdminProfile(this.username).subscribe(
      (res: any) => {
        this.username = res.message;
        this.service.changeAdmin.reset();
        this.initializeAdminData();
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
          alert("Changing profile data failed .Please enter different username.");
        }
        else{
          alert("Unknown error");
        }
      }
    );
  }
  //#endregion
  //#region 3 - Metoda za izmenu sifre
  changePassword(): void {
    this.service.changePassword(this.username).subscribe(
      (res: any) => {
        alert("Changing password successfully.");
        this.service.changeAdminPassword.reset();
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
