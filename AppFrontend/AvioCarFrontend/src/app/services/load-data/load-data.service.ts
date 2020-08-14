import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {
  readonly BaseURI = 'http://localhost:57382/api';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  form1 = this.fb.group({
    AirlinePlusCar: ['', Validators.required]
  });

  form2 = this.fb.group({
    Points300: ['', Validators.required]
  });

  form3 = this.fb.group({
    Points600: ['', Validators.required]
  });

  form4 = this.fb.group({
    Points1200: ['', Validators.required]
  });

  changeAdmin = this.fb.group({
    UserName: [''],
    Email: ['', Validators.email],
    PhoneNumber: [''],
    FirstName: [''],
    LastName: [''],
    City: ['']
  });

  changeAdminPassword = this.fb.group({
    CurrentPassword: ['', [Validators.required, Validators.minLength(8)]],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.compareNewPasswords })
  });


  // metoda za proveru identicnosti sifri
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

  loadDiscounts() {
    return this.http.get(this.BaseURI + '/LoadData/GetDiscounts');
  }

  changeDiscount(body){
    return this.http.put(this.BaseURI + '/LoadData/ChangeDiscount', body);
  }

  loadAvioAdmin(username: string){
    return this.http.get(this.BaseURI + '/LoadData/GetAvioAdmin/' + username);
  }

  changeAdminProfile(){
    // TO DO: pozvati backend da promeni admina
  }

  changdeAdminPassword(){
    // TO DO: pozvati backend da promeni sifru
  }
}
