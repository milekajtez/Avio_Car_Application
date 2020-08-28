import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Airline } from 'src/app/entities/avio-entities/airline/airline';
import { AbstractFilterParam } from 'src/app/entities/abstract-filter-param/abstract-filter-param';
import { StringFilterParam } from 'src/app/entities/string-filter-param/string-filter-param';
import { NumberFilterParam } from 'src/app/entities/number-filter-param/number-filter-param';
import { RentACarServiceComboBox } from 'src/app/entities/rent-a-car-service-combo-box/rent-a-car-service-combo-box';
import { Friend } from 'src/app/entities/regular-user-entities/friend/friend';

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
  //#region 4 - Metode za filtriranje aviokompanija
  checkAirlineNameFilter(airline: Airline, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof StringFilterParam && filterParam.getFilterParamName() === 'airlineNameFilter' && !airline.airlineName.toLowerCase().includes(filterParam.getFilterParamValue().toLowerCase());
  }
  
  checkAirlineRatingFilter(airline: Airline, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof NumberFilterParam && filterParam.getFilterParamName() === 'airlineRatingFilter' && !(Number(airline.airlineRating) == filterParam.getFilterParamValue());
  }

  filterAirlines(airlines: Airline[], filterParams: AbstractFilterParam[]): Airline[] {
    let filteredAirlines = new Array<Airline>();
    for (const airline of airlines) {
      let addAirline = true;
      for (const filterParam of filterParams) {
        if (this.checkAirlineNameFilter(airline, filterParam) || this.checkAirlineRatingFilter(airline, filterParam)){
          addAirline = false;
        }
      }

      if (addAirline){
        filteredAirlines.push(airline);
      }
    }
    return filteredAirlines;
  }
  //#endregion
  //#region 5 - Metode za filtriranje rent-a-car servisa
  checkAirlineRentACarNameFilter(rentACarService: RentACarServiceComboBox, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof StringFilterParam && filterParam.getFilterParamName() === 'rentACarServiceNameFilter' && !rentACarService.carServiceName.toLowerCase().includes(filterParam.getFilterParamValue().toLowerCase());
  }
  
  checkRentACarRatingFilter(rentACarService: RentACarServiceComboBox, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof NumberFilterParam && filterParam.getFilterParamName() === 'rentACarServiceRatingFilter' && !(Number(rentACarService.carServiceRating) == filterParam.getFilterParamValue());
  }

  filterRentACarService(rentACarServices: RentACarServiceComboBox[], filterParams: AbstractFilterParam[]): RentACarServiceComboBox[] {
    let filteredServices = new Array<RentACarServiceComboBox>();
    for (const service of rentACarServices) {
      let addService = true;
      for (const filterParam of filterParams) {
        if (this.checkAirlineRentACarNameFilter(service, filterParam) || this.checkRentACarRatingFilter(service, filterParam)){
          addService = false;
        }
      }

      if (addService){
        filteredServices.push(service);
      }
    }
    return filteredServices;
  }
  //#endregion
  //#region 6 - Forma za slanje zahteva za prijateljstvo
  sendRequestForm = this.fb.group({
    Username: ['', Validators.required]
  });
  //#endregion
  //#region 7 - Metoda za ucitavanje zahteva
  loadRequestsMethod(username: string, typeOfLoad: string){
    return this.http.get(this.BaseURI + '/RegularUser/GetRequests/' + username + "/" + typeOfLoad);
  }
  //#endregion
  //#region 8 - Metoda za slanje zahteva
  sendRequestMethod(myUserName: string) {
    var body = {
      Username: this.sendRequestForm.value.Username,
    }
    return this.http.post(this.BaseURI + '/RegularUser/SendRequest/' + myUserName, body);
  }
  //#endregion
  //#region 9 - Metoda za odustajanje od mog zahteva
  deleteRequest(myUsername: string, friendUsername: string) {
    return this.http.delete(this.BaseURI + '/RegularUser/DeleteMyRequest/' + myUsername + '/' + friendUsername);
  }
  //#endregion
  //#region 10 - Metoda za potvrdu zahteva
  confirmRequest(myUsername: string, friendUsername: string) {
    return this.http.get(this.BaseURI + '/RegularUser/ConfirmRequest/' + myUsername + '/' + friendUsername);
  }
  //#endregion
  //#region 11 - Metoda za odbijanje zahteva
  rejectRequest(myUsername: string, friendUsername: string) {
    return this.http.delete(this.BaseURI + '/RegularUser/DeleteMyRequest/' + myUsername + '/' + friendUsername);
  }
  //#endregion
  //#region 12 - Metoda za ucitavanje prijatelja
  loadMyFriends(myUserName){
    return this.http.get(this.BaseURI + '/RegularUser/LoadMyFriends/' + myUserName);
  }
  //#endregion
  //#region 13 - Metode za filtriranje prijatelja
  checkFriendFirstNameFilter(friend: Friend, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof StringFilterParam && filterParam.getFilterParamName() === 'firstNameFilter' && !friend.firstname.toLowerCase().includes(filterParam.getFilterParamValue().toLowerCase());
  }
  
  checkFriendLastNameFilter(friend: Friend, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof StringFilterParam && filterParam.getFilterParamName() === 'lastNameFilter' && !friend.lastname.toLowerCase().includes(filterParam.getFilterParamValue().toLowerCase());
  }

  filterFriends(friends: Friend[], filterParams: AbstractFilterParam[]): Friend[] {
    let filteredFriends = new Array<Friend>();
    for (const friend of friends) {
      let addFriend = true;
      for (const filterParam of filterParams) {
        if (this.checkFriendFirstNameFilter(friend, filterParam) || this.checkFriendLastNameFilter(friend, filterParam)){
          addFriend = false;
        }
      }

      if (addFriend){
        filteredFriends.push(friend);
      }
    }
    return filteredFriends;
  }
  //#endregion
  //#region 14 - Metoda za brisanje prijatelja
  deleteFriend(myUsername: string, friendUsername: string){
    return this.http.delete(this.BaseURI + '/RegularUser/DeleteFriend/' + myUsername + '/' + friendUsername);
  }
  //#endregion
}
