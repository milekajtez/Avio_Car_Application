import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/services/register-and-login/register-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-airline-registration',
  templateUrl: './airline-registration.component.html',
  styleUrls: ['./airline-registration.component.css']
})
export class AirlineRegistrationComponent implements OnInit {

  constructor(public service: RegisterService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.service.airlineRegister().subscribe(
      (res : any) => {
        alert("Registration of airline successfully.");
        this.service.regAirlineForm.reset();
      },
      err => {
        if(err.error === "Please enter a different airline name."){
          alert("Please enter a different airline name.");
        }
        else{
          alert("Unknown error");
          console.log(err);
        }
      }
    );

  }

}
