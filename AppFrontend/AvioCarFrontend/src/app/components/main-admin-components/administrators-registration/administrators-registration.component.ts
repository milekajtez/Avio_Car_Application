import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/services/register-and-login/register-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-administrators-registration',
  templateUrl: './administrators-registration.component.html',
  styleUrls: ['./administrators-registration.component.css']
})
export class AdministratorsRegistrationComponent implements OnInit {
  registrationLabel : string;

  constructor(public service: RegisterService, private toastr: ToastrService) 
  {
    this.registrationLabel = "";
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // pozivacu servis koji ce pozivati regsitrciju
    console.log(this.service.regAdminForm.value);        // test za klik na regrister button
    this.service.adminRegister().subscribe(
      (res: any) => {
        if (res.succeeded)
        {
          this.toastr.success('New admisnistrator created!', 'Registration successful.');
          alert("Registration of administrator successfully.");
          this.service.regAdminForm.reset();
        }
      },
      err => {
        if(err.error === "Registration unsuccessfully. Please enter different jmbg.")
        {
          this.registrationLabel = "Registration unsuccessfully. Please enter different jmbg.";
        }
        else if(err.error === "Username is incorrect or has already been reserved")
        {
          this.registrationLabel = "Username is incorrect or has already been reserved";
        }
        else
        {
          this.registrationLabel = "";
        }
      }
    );
  }
}
