import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  readonly BaseURI = 'http://localhost:57382/api';
  

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  // forma za registraciju
  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.comparePasswords }),
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    Jmbg: ['', [Validators.required, Validators.pattern("^[0-9]{13,13}")]],
    City: ['', Validators.required],
    Telephone: ['', [Validators.required, Validators.pattern("^[0-9]{9,10}")]],
    Passport: ['', Validators.pattern("^[0-9]{9}")]
  });

  //frma za logovanje
  formLoginModel = this.fb.group({
    UserName: ['', Validators.required],
    Password: ['', [Validators.required, Validators.minLength(8)]]
  });

  // metoda za proveru identicnosti sifri
  comparePasswords(fb: FormGroup) {
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

  // metoda za slanje zahteva za registraciju
  register() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      Password: this.formModel.value.Passwords.Password,
      FirstName: this.formModel.value.FirstName,
      LastName: this.formModel.value.LastName,
      Jmbg: this.formModel.value.Jmbg,
      City: this.formModel.value.City,
      Telephone: this.formModel.value.Telephone,
      Passport: this.formModel.value.Passport
    };

    // prvremeno stavljam u local storage korisnika koji se registruje
    localStorage.setItem('registration', body.Jmbg);
    
    return this.http.post(this.BaseURI + '/ApplicationUser/Register', body);
  }

  //metoda za potvrdu registracije
  confirm() {
    var body = {
      UserName: null,
      Email: null,
      Password: null,
      FirstName: null,
      LastName: null,
      Jmbg : localStorage.getItem('registration'),
      City: null,
      Telephone: null,
      Passport: null
    }

    return this.http.post(this.BaseURI + '/ApplicationUser/RegisterConfirm', body);
  }


  login() {
    var body = {
      UserName: this.formLoginModel.value.UserName,
      Password: this.formLoginModel.value.Password
    }

    return this.http.post(this.BaseURI + '/ApplicationUser/Login', body);
  }
}
