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
    PhoneNumber: ['',Validators.pattern("^[0-9]{9,10}")],
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


  destinationForm = this.fb.group({
    Airline: ['', Validators.required],
    AirportName: ['', Validators.required],
    City: ['',Validators.required],
    Country: ['', Validators.required]
  });

  deleteDestinationForm = this.fb.group({
    Destination: ['', Validators.required]
  });

  changeDestinationForm = this.fb.group({
    Destination: ['', Validators.required],
    AirportName: [''],
    City: [''],
    Country: ['']
  });

  deleteFlightForm = this.fb.group({
    Flight: ['', Validators.required]
  });

  changeFlightForm = this.fb.group({
    Flight: ['', Validators.required],
    StartTime: [''],
    EndTime: [''],
    StartLocation: ['', Validators.pattern("[a-z A-Z]+")],
    EndLocation: ['', Validators.pattern("[a-z A-Z]+")],
    FlightLength: ['', Validators.pattern("[0-9]{1,6}")],
    AdditionalInformation: [''],
    NumberOfTransfers: ['', Validators.pattern("[0-9]+")],
    AllTransfers: [''],
    PlaneName: [''],
    LugageWeight: ['', Validators.pattern("[0-9]+")]
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

  // metoda za ucitavanje popusta
  loadDiscounts() {
    return this.http.get(this.BaseURI + '/LoadData/GetDiscounts');
  }

  // metoda za izmenu popusta
  changeDiscount(body){
    return this.http.put(this.BaseURI + '/LoadData/ChangeDiscount', body);
  }

  // metoda za ucitavanje avio admina 
  loadAvioAdmin(username: string){
    return this.http.get(this.BaseURI + '/LoadData/GetAvioAdmin/' + username);
  }

  // metoda za promeni podataka admina
  changeAdminProfile(username: string){
    var body = {
      CurrentUsername: username,
      UserName: this.changeAdmin.value.UserName,
      Email: this.changeAdmin.value.Email,
      PhoneNumber: this.changeAdmin.value.PhoneNumber,
      FirstName: this.changeAdmin.value.FirstName,
      LastName: this.changeAdmin.value.LastName,
      City: this.changeAdmin.value.City
    }

    return this.http.put(this.BaseURI + '/LoadData/ChangeAdminProfile', body);
  }

  // metoda za promenu sifre
  changePassword(username : string){
    var body = {
      Username: username,
      CurrentPassword: this.changeAdminPassword.value.CurrentPassword,
      NewPassword:  this.changeAdminPassword.value.Passwords.Password
    }

    return this.http.put(this.BaseURI + '/LoadData/ChangePassword', body);
  }

  // etoda za ucitavanje avio kompanija
  loadAirlines() {
    return this.http.get(this.BaseURI + '/LoadData/GetAirlines');
  }

  // metoda za dodavanje nove destinacije
  addNewDestination() {
    var body = {
      AirlineID: this.destinationForm.value.Airline,
      AirportName: this.destinationForm.value.AirportName,
      City: this.destinationForm.value.City,
      Country: this.destinationForm.value.Country
    }
    return this.http.post(this.BaseURI + '/LoadData/AddDestination', body);
  }

  // metoda za ucitavanje svih letova
  loadFlights() {
    return this.http.get(this.BaseURI + '/LoadData/GetFlights');
  }

  // metoda za ucitavanje svih destinacija
  loadAllDestinations(){
    return this.http.get(this.BaseURI + '/LoadData/GetDestination');
  }

  // metoda za ucitavanje destinacija odredjene aviokompanije
  loadDestinations(airlineID: string){
    return this.http.get(this.BaseURI + '/LoadData/GetDestinations/' + airlineID);
  }

  // metoda za ucitavanje letova odredjene aviokompanije
  loadAirlineFlights(airlineID: string){
    return this.http.get(this.BaseURI + '/LoadData/GetAirlineFlights/' + airlineID);
  }

  // metoda za brisanje destinacije
  deleteDestination(airportID: string){
    return this.http.delete(this.BaseURI + '/LoadData/DeleteDestination/' + airportID);
  }

  // metoda za brisanje destinacije
  deleteFlight(flightID: string){
    return this.http.delete(this.BaseURI + '/LoadData/DeleteFlight/' + flightID);
  }

  // metoda za izmenu destinacije
  changeDestination(){
    var body = {
      AirlineID: this.changeDestinationForm.value.Destination,
      AirportName: this.changeDestinationForm.value.AirportName,
      City: this.changeDestinationForm.value.City,
      Country: this.changeDestinationForm.value.Country
    }

    return this.http.put(this.BaseURI + '/LoadData/ChangeDestination/', body);
  }

  changeFlight(){
    var body = {
      AirlineID: this.changeFlightForm.value.Flight,
      StartTime: this.changeFlightForm.value.StartTime,
      EndTime: this.changeFlightForm.value.EndTime,
      StartLocation: this.changeFlightForm.value.StartLocation,
      EndLocation: this.changeFlightForm.value.EndLocation,
      FlightLength: this.changeFlightForm.value.FlightLength,
      AdditionalInformation: this.changeFlightForm.value.AdditionalInformation,
      NumberOfTransfers: this.changeFlightForm.value.NumberOfTransfers,
      AllTransfers: this.changeFlightForm.value.AllTransfers,
      PlaneName: this.changeFlightForm.value.PlaneName,
      LugageWeight: this.changeFlightForm.value.LugageWeight,
    }

    // AirlineID je ustvari ID flihght-a..stavio sam AirlineID jer imam vec
    // klasu na backecu koja ima AirlineID..pa da ne pravim novi klasu

    return this.http.put(this.BaseURI + '/LoadData/ChangeFlight/', body);
  }
}
