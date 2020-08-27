import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegularUserService {
  readonly BaseURI = 'http://localhost:57382/api';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  //#region 1 - Forma za menjanje profilnih podataka i forma za menjanje sifre
  changeRegularUser = this.fb.group({
    UserName: [''],
    Email: ['', Validators.email],
    PhoneNumber: ['',Validators.pattern("^[0-9]{9,10}")],
    FirstName: [''],
    LastName: [''],
    City: [''],
    NumberOfPassport: ['', Validators.pattern("^[0-9]{9}")]
  });

  changeRegularUserPassword = this.fb.group({
    CurrentPassword: ['', [Validators.required, Validators.minLength(8)]],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.compareNewPasswords })
  });
  //#endregion
  //#region 2 - Metoda za proveru ispravnog unosa nove sifre
  compareNewPasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }
  //#endregion
  //#region 3 - Metoda za izmenu profilnih podataka i metoda za izmene sifre
  changeRegularUserProfile(username: string){
    var body = {
      CurrentUsername: username,
      UserName: this.changeRegularUser.value.UserName,
      Email: this.changeRegularUser.value.Email,
      PhoneNumber: this.changeRegularUser.value.PhoneNumber,
      FirstName: this.changeRegularUser.value.FirstName,
      LastName: this.changeRegularUser.value.LastName,
      City: this.changeRegularUser.value.City,
      NumberOfPassport: this.changeRegularUser.value.NumberOfPassport
    }
    return this.http.put(this.BaseURI + '/RegularUser/ChangeRegularUserProfile', body);
  }
  
  changePassword(username : string){
    var body = {
      Username: username,
      CurrentPassword: this.changeRegularUserPassword.value.CurrentPassword,
      NewPassword:  this.changeRegularUserPassword.value.Passwords.Password
    }
    return this.http.put(this.BaseURI + '/LoadData/ChangePassword', body);
  }
  //#endregion

}
