import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Airline } from 'src/app/entities/avio-entities/airline/airline';
import { AbstractFilterParam } from 'src/app/entities/abstract-filter-param/abstract-filter-param';
import { StringFilterParam } from 'src/app/entities/string-filter-param/string-filter-param';
import { NumberFilterParam } from 'src/app/entities/number-filter-param/number-filter-param';
import { Friend } from 'src/app/entities/regular-user-entities/friend/friend';
import { Flight } from 'src/app/entities/avio-entities/flight/flight';
import { Ticket } from 'src/app/entities/avio-entities/ticket/ticket';

@Injectable({
  providedIn: 'root'
})
export class RegularUserService {
  //readonly BaseURI = 'https://localhost:44319/api';
  readonly BaseURI = 'http://localhost:80/api';
  //readonly BaseURI = 'https://kubernetes.docker.internal:6443'

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
  //#region 5 - Forma za slanje zahteva za prijateljstvo
  sendRequestForm = this.fb.group({
    Username: ['', Validators.required]
  });
  //#endregion
  //#region 6 - Metoda za ucitavanje zahteva
  loadRequestsMethod(username: string, typeOfLoad: string){
    return this.http.get(this.BaseURI + '/RegularUser/GetRequests/' + username + "/" + typeOfLoad);
  }
  //#endregion
  //#region 7 - Metoda za slanje zahteva
  sendRequestMethod(myUserName: string) {
    var body = {
      Username: this.sendRequestForm.value.Username,
    }
    return this.http.post(this.BaseURI + '/RegularUser/SendRequest/' + myUserName, body);
  }
  //#endregion
  //#region 8 - Metoda za odustajanje od mog zahteva
  deleteRequest(myUsername: string, friendUsername: string) {
    return this.http.delete(this.BaseURI + '/RegularUser/DeleteMyRequest/' + myUsername + '/' + friendUsername);
  }
  //#endregion
  //#region 9 - Metoda za potvrdu zahteva
  confirmRequest(myUsername: string, friendUsername: string) {
    return this.http.get(this.BaseURI + '/RegularUser/ConfirmRequest/' + myUsername + '/' + friendUsername);
  }
  //#endregion
  //#region 10 - Metoda za odbijanje zahteva
  rejectRequest(myUsername: string, friendUsername: string) {
    return this.http.delete(this.BaseURI + '/RegularUser/DeleteMyRequest/' + myUsername + '/' + friendUsername);
  }
  //#endregion
  //#region 11 - Metoda za ucitavanje prijatelja
  loadMyFriends(myUserName){
    return this.http.get(this.BaseURI + '/RegularUser/LoadMyFriends/' + myUserName);
  }
  //#endregion
  //#region 12 - Metode za filtriranje prijatelja
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
  //#region 13 - Metoda za brisanje prijatelja
  deleteFriend(myUsername: string, friendUsername: string){
    return this.http.delete(this.BaseURI + '/RegularUser/DeleteFriend/' + myUsername + '/' + friendUsername);
  }
  //#endregion
  //#region 14 - Forma za pretragu letova
  searchFlightForm = this.fb.group({
    StartLocation: [''],
    EndLocation: [''],
    StartTime: ['']
  });
  //#endregion
  //#region 15 - Metode za filtriranje prijatelja
  checkFlightLaguageWeightFilter(flight: Flight, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof NumberFilterParam && filterParam.getFilterParamName() === 'laguageWeightFilter' && !(Number(flight.laguageWeight) == filterParam.getFilterParamValue());
  }
  
  checkFlightTimeFilter(flight: Flight, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof NumberFilterParam && filterParam.getFilterParamName() === 'flightTimeFilter' && !(Number(flight.flightTime) == filterParam.getFilterParamValue());
  }

  checkFlightLengthFilter(flight: Flight, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof NumberFilterParam && filterParam.getFilterParamName() === 'flightLengthFilter' && !(Number(flight.flightLength) == filterParam.getFilterParamValue());
  }

  filterFlights(flights: Flight[], filterParams: AbstractFilterParam[]): Flight[] {
    let filteredFlights = new Array<Flight>();
    for (const flight of flights) {
      let addFlight = true;
      for (const filterParam of filterParams) {
        if (this.checkFlightLaguageWeightFilter(flight, filterParam) || this.checkFlightTimeFilter(flight, filterParam) ||
          this.checkFlightLengthFilter(flight, filterParam)){
          addFlight = false;
        }
      }

      if (addFlight){
        filteredFlights.push(flight);
      }
    }
    return filteredFlights;
  }
  //#endregion
  //#region 16 - Forma za biranje prijatelja,za rezervaciju i metoda za proveru broja pasosa
  chooseFriendForm = this.fb.group({
    Friend: ['', Validators.required],
    FriendPassport: ['', [Validators.required, Validators.pattern("[0-9]{9}")]]
  });

  checkPassport(username: string, passportNumber: string){
    return this.http.get(this.BaseURI + '/RegularUser/CheckPassport/' + username + "/" + passportNumber);
  }
  //#endregion
  //#region 17 - Metoda za rezervaciju leta (bez prijatelja)
  bookFlight(username: string, ticketID: string){
    return this.http.get(this.BaseURI + '/RegularUser/BookAFlight/' + username + "/" + ticketID)
  }
  //#endregion
  //#region 18 - Metoda za rezervaciju leta (sa prijateljima)
  bookingFlightForFriendAndMe(username: string, chosenFriends: Array<Friend>, selectedSeats: Array<Ticket>){
    var friendsName = "";
    var ticketIDs = "";

    chosenFriends.forEach(element => {
      friendsName += element.username;
      friendsName += '|';
    });

    selectedSeats.forEach(element => {
      ticketIDs += element.ticketID;
      ticketIDs += '|';
    });

    friendsName = friendsName.substring(0, friendsName.length - 1);
    ticketIDs = ticketIDs.substring(0, ticketIDs.length - 1);

    var body = {
      Username: username,
      Tickets: ticketIDs,
      Friends: friendsName
    }

    return this.http.post(this.BaseURI + '/RegularUser/FriendAndMeBookingFlight', body);
  }
  //#endregion
  //#region 19 - Metoda za izmenu karte pri potvrdi/odbijanju rezervacije eta od strane prijatelja
  changeTicket(ticketID: string, typeChange: string){
    return this.http.get(this.BaseURI + '/RegularUser/ChangeReservationTicket/' + ticketID + "/" + typeChange);
  }
  //#endregion
  //#region 20 - Metoda za ucitavanje aktivnih/proslih rezervacija odredjenog korisnika
  loadReservations(username: string, loadType: string){
    return this.http.get(this.BaseURI + '/RegularUser/LoadReservations/' + username + '/' + loadType);
  }
  //#endregion
  //#region 21 - Metoda za otkazivanje aktivnih rezervacija
  deleteReservation(username: string, ticketID: string){
    return this.http.delete(this.BaseURI + '/RegularUser/DeleteReservation/' + username + '/' + ticketID);
  }
  //#endregion
  //#region 22 - Metoda za ocenjivanje leta, odrejdene rezervacije
  ratingFlight(ticketID: string, rating: string){
    return this.http.get(this.BaseURI + '/RegularUser/RatingFlight/' + ticketID + '/' + rating);
  }
  //#endregion
  //#region 23 - Metoda za ucitavanje svih letova tj mestau njima koja su za brzu rezervaciju
  loadQuickReservations(username: string){
    return this.http.get(this.BaseURI + '/RegularUser/LoadQuickReservations/' + username);
  }
  //#endregion
}