import { Component, OnInit } from '@angular/core';
import { RentACarService } from 'src/app/services/rent-a-car/rent-a-car.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared/shared-data.service';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';

@Component({
  selector: 'app-car-profile',
  templateUrl: './car-profile.component.html',
  styleUrls: ['./car-profile.component.css']
})
export class CarProfileComponent implements OnInit {
  username: string;
  email: string;
  phonenumber: string;
  firstname: string;
  lastname: string;
  city: string;

  constructor(public carService: RentACarService, private toastr: ToastrService, private route: ActivatedRoute, 
    private data: SharedDataService, public service: LoadDataService) 
  {
    route.params.subscribe(params => {
      this.username = params['UserName'];
    });
  }

  ngOnInit(): void {
    this.initializeAdminData();
    this.data.currentMessage.subscribe(message => this.username = message);
  }

  newMessage() {
    this.data.changeMessage(this.username);
  }

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
        alert("Loading current avio admin is unsuccessfully.");
      }
    );
  }

  onSubmit(){
    this.service.changeAdminProfile(this.username).subscribe(
      (res: any) => {
        this.username = res.message;
        this.service.changeAdmin.reset();
        this.initializeAdminData();
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

  changePassword(){
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
