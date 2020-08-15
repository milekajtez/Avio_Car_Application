import { Component, OnInit, Input } from '@angular/core';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-avio-profile',
  templateUrl: './avio-profile.component.html',
  styleUrls: ['./avio-profile.component.css']
})
export class AvioProfileComponent implements OnInit {
  username: string;
  email: string;
  phonenumber: string;
  firstname: string;
  lastname: string;
  city: string;

  constructor(public service: LoadDataService, private toastr: ToastrService, private route: ActivatedRoute) 
  {
    route.params.subscribe(params => {
      this.username = params['UserName'];
    });
   }

  ngOnInit(): void {
    this.initializeAvioAdminData();
  }

  initializeAvioAdminData() : void {
    this.service.loadAvioAdmin(this.username).subscribe(
      (res: any) => {
        console.log(res);
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
        this.service.changeAdmin.reset();
        this.initializeAvioAdminData();
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
    // TO DO: obraditi odgovor
  }

}
