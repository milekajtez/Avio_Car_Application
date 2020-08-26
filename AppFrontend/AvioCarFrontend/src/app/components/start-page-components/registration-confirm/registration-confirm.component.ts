import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/services/register-and-login/register-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration-confirm',
  templateUrl: './registration-confirm.component.html',
  styleUrls: ['./registration-confirm.component.css']
})
export class RegistrationConfirmComponent implements OnInit {

  constructor(public service: RegisterService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.confirmRegistration();
    localStorage.removeItem('registration');
  }

  //#region 1 - Metoda koja poziva metodu sa servisa koja salje zahtev za menjanje bool polja regstracije
  confirmRegistration() : void {
    this.service.confirm().subscribe(
      (res: any) => {
        console.log(res);
      }
    );
  }
  //#endregion
}
