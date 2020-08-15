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
    this.initializeAvioAdminData();
    this.data.currentMessage.subscribe(message => this.username = message)
  }

  newMessage() {
    this.data.changeMessage(this.username);
  }

  initializeAvioAdminData() : void {
    this.service.loadAvioAdmin(this.username).subscribe(
      (res: any) => {
        this.username = res.userName;
        this.email = res.email;
        this.phonenumber = res.phoneNumber;
        this.firstname = res.firstName;
        this.lastname = res.lastName;
        this.city = res.city;
      },
      err => {
        alert("Loading current avio admin is unsuccessfully.");
      }
    );
  }

  onSubmit() : void {
    this.service.changeAdminProfile(this.username).subscribe(
      (res: any) => {
        this.username = res.message;
        this.service.changeAdmin.reset();
        this.initializeAvioAdminData();
        this.newMessage();
        alert("Change profile data successfully.");
      },
      err => {
        console.log(err);
        if(err.error === "Change unsucessfully. User is not registred."){
          alert("Change unsucessfully. User is not registred.");
        }
        else if(err.error === "Change unsucessfully.You must enter new data in form."){
          alert("Change unsucessfully.You must enter new data in form.");
        }
        else if(err.error === "Change unsucessfully.Please input different username."){
          alert("Change unsucessfully.Please enter different username.");
        }
        else{
          alert("Unknown error");
        }
      }
    );
  }

  changePassword(): void {
    this.service.changePassword(this.username).subscribe(
      (res: any) => {
        alert("Password changed successfully.");
        this.service.changeAdminPassword.reset();
      },
      err => {
        if(err.error === "Server didn't find the username. Changing password is unsuccessfully."){
          alert("Server didn't find the username. Changing password is unsuccessfully.");
        }
        else if(err.error === "Changing password is unsuccessfully. Please enter correct current password."){
          alert("Changing password is unsuccessfully. Please enter correct current password.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }

}
