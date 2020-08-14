import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/services/register-and-login/register-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rent-a-car-registration',
  templateUrl: './rent-a-car-registration.component.html',
  styleUrls: ['./rent-a-car-registration.component.css']
})
export class RentACarRegistrationComponent implements OnInit {

  constructor(public service: RegisterService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.service.rentACarRegister().subscribe(
      (res : any) => {
        alert("Registration of rent-a-car successfully.");
        this.service.regRentACarForm.reset();
      },
      err => {
        if(err.error === "Please enter a different rent-a-car name."){
          alert("Please enter a different rent-a-car name.");
        }
        else{
          alert("Unknown error");
          console.log(err);
        }
      }
    );
  }

}
