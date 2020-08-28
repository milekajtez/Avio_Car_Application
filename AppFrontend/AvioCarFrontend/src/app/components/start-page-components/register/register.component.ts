import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from 'src/app/services/register-and-login/register-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registrationLabel : string;
  load : number;
  
  constructor(public service: RegisterService, private toastr: ToastrService) 
  {
    this.registrationLabel = "";
    this.load = 0;
  }

  ngOnInit(): void {
    this.service.formModel.reset();
  }

  //#region 1 - Metoda za registraciju korisnika
  onSubmit() {
    this.load = 1;
    this.service.register().subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successful.');
          alert("Registration successful. Please go to your e-mail and confirm your registration.");
          this.load = 0;
          this.cancelRegister.emit(false);
        }
      },
      err => {
        this.load = 0;
        console.log(err);
        if(err.error === "Registration unsuccessfully. Please enter different jmbg.") {
          this.registrationLabel = err.error;
        }
        else if(err.error === "Username is incorrect or has already been reserved.") {
          this.registrationLabel = err.error;
        }
        else {
          this.registrationLabel = "";
        }
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za zatvaranje forme za registraciju
  cancel() {
    this.cancelRegister.emit(false);
    this.load = 0;
  }
  //#endregion
}
