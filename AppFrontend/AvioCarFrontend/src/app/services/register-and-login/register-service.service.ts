import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class RegisterService {
  //readonly BaseURI = 'https://localhost:44319/api';
  readonly BaseURI = 'http://localhost:80/api';
  //readonly BaseURI = 'https://kubernetes.docker.internal:6443'

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  //#region 1 - Forma za registraciju obicnog korisnika i forma za registraciju administratora
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

  regAdminForm = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.comparePasswords }),
    Jmbg: ['', [Validators.required, Validators.pattern("^[0-9]{13,13}")]],
    Telephone: ['', [Validators.required, Validators.pattern("^[0-9]{9,10}")]],
    AdminType: ['', Validators.required]
  });
  //#endregion
  //#region 2 - Forma za logovanje
  formLoginModel = this.fb.group({
    UserName: ['', Validators.required],
    Password: ['', [Validators.required, Validators.minLength(8)]]
  });
  //#endregion
  //#region 3 - Forma za registraciju avio komapnije
  regAirlineForm = this.fb.group({
    AirlineName: ['', Validators.required],
    AirlineAddress: ['', [Validators.required, Validators.pattern("[a-z A-Z]+,\[0-9]+,\[a-z A-Z]+")]],
    AirlinePromotionDescription: ['', Validators.required],
    AirlinePriceList: ['', Validators.required]
  });
  //#endregion
  //#region 4 - Metoda za proveru identicnosti sifri
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
  //#endregion
  //#region 5 - Metoda za slanje zahteva za registraciju i metoda za potvrdu registracije
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
    // privremeno stavljam u local storage korisnika koji se registruje
    localStorage.setItem('registration', body.Jmbg);
    return this.http.post(this.BaseURI + '/ApplicationUser/Register', body);
  }

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
  //#endregion
  //#region 6 - Metoda za slanje zahteva za obicno logovanje i metoda za slanje zahteva za logovanje preko mreze
  login() {
    var body = {
      UserName: this.formLoginModel.value.UserName,
      Password: this.formLoginModel.value.Password
    }
    return this.http.post(this.BaseURI + '/ApplicationUser/Login', body);
  }

  externalLogin(formData){
    return this.http.post(this.BaseURI + '/ApplicationUser/SocialLogin', formData);
  }
  //#endregion
  //#region 7 - Metoda za registraciju adminstratora i metoda za izmenu sifre pri prvom logovanju administratora
  adminRegister() {
    var body = {
      UserName: this.regAdminForm.value.UserName,
      Email: this.regAdminForm.value.Email,
      Password: this.regAdminForm.value.Passwords.Password,
      Jmbg: this.regAdminForm.value.Jmbg,
      Telephone: this.regAdminForm.value.Telephone
    }
    return this.http.post(this.BaseURI + '/ApplicationUser/AdminRegistration', body);
  }

  changePasswordFirstLogin(body) {
    return this.http.post(this.BaseURI + '/ApplicationUser/ChangeAdminPassword', body);
  }
  //#endregion
  //#region 8 - Metoda za regsitraciju nove aviokompanije
  airlineRegister() {
    var body = {
      Name: this.regAirlineForm.value.AirlineName,
      Address: this.regAirlineForm.value.AirlineAddress,
      PromotionDescription: this.regAirlineForm.value.AirlinePromotionDescription,
      PriceList: this.regAirlineForm.value.AirlinePriceList
    }
    return this.http.post(this.BaseURI + '/ApplicationUser/AirlineRegistration', body);
  }
  //#endregion
}
