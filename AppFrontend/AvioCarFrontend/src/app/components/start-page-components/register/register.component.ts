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
  /*model: any = {};
  registeredUsers: any[] = [];*/
  
  
  constructor(public service: RegisterService, private toastr: ToastrService) 
  {
    this.registrationLabel = "";

    this.load = 0;
  }

  ngOnInit(): void {
    this.service.formModel.reset();
  }

  onSubmit() {
    this.load = 1;
    console.log(this.service.formModel.value);        // test za klik na regrister button

    this.service.register().subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successful.');
          alert("Registration successful. Please go to your e-mail and confirm your registration.");
          this.load = 0;
          this.cancelRegister.emit(false);
        } else {
          res.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Username is already taken','Registration failed.');
                break;

              default:
              this.toastr.error(element.description,'Registration failed.');
                break;
            }
          });
        }
      },
      err => {
        console.log(err);
        console.log(err.error);
        this.load = 0;
        if(err.error === "Registration unsuccessfully. Please enter different jmbg."){
          this.registrationLabel = "Registration unsuccessfully. Please enter different jmbg.";
        }else{
          this.registrationLabel = "";
        }
      }
    );
  }

  cancel() {
    this.cancelRegister.emit(false);
    this.load = 0;
  }

}
