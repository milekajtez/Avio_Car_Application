import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RentACarService {
  readonly BaseURI = 'http://localhost:57382/api';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  addBranchForm = this.fb.group({
    RentACarService: ['', Validators.required],
    BranchOfficeAddress: ['', Validators.required],
    City: ['', Validators.required],
    Country: ['',Validators.required]
  });

  deleteBranchForm = this.fb.group({
    BranchOffice: ['', Validators.required]
  });

  changeBranchForm = this.fb.group({
    BranchOffice: ['', Validators.required],
    BranchOfficeAddress: [''],
    City: [''],
    Country: ['']
  });

  addCarForm = this.fb.group({
    Name: ['', Validators.required],
    Brand: ['', Validators.required],
    Model: ['', Validators.required],
    YearOfManufacture: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    NumberOfSeats: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    CardType: ['', Validators.required],
    LugageWeight: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    IsQuickBooking: ['', [Validators.required]],
    Flight: [''],
    RentACarService: ['', Validators.required],
  });

  deleteCarForm = this.fb.group({
    Car: ['', Validators.required]
  });

  changeCarForm = this.fb.group({
    Car: ['', Validators.required],
    Name: [''],
    Brand: [''],
    Model: [''],
    YearOfManufacture: ['', Validators.pattern("[0-9]+")],
    NumberOfSeats: ['', Validators.pattern("[0-9]+")],
    CardType: [''],
    LugageWeight: ['', Validators.pattern("[0-9]+")],
    IsQuickBooking: [''],
    Flight: ['']
  });

  // metoda za ucitavanje svih rent-a-car servisa
  loadRentACarServices() {
    return this.http.get(this.BaseURI + '/RentACar/GetRentACarServices');
  }

  // metoda za ucitavanje svih filijala
  loadBranchOffices() {
    return this.http.get(this.BaseURI + '/RentACar/GetBranchOffices');
  }

  // metoda za dodavanje nove filijale
  addNewBranch(){
    var body = {
      RentACarServiceID: this.addBranchForm.value.RentACarService,
      BranchOfficeAddress: this.addBranchForm.value.BranchOfficeAddress,
      City: this.addBranchForm.value.City,
      Country: this.addBranchForm.value.Country
    }

    return this.http.post(this.BaseURI + '/RentACar/AddBranchOffice', body);
  }

  // metoda za brisanje filijale
  deleteBranch(branchOfficeID: string){
    return this.http.delete(this.BaseURI + '/RentACar/DeleteBranchOffice/' + branchOfficeID);
  }

  // metoda za izmenu filijale
  changeBranchOffice(){
    var body = {
      RentACarServiceID: this.changeBranchForm.value.BranchOffice,
      BranchOfficeAddress: this.changeBranchForm.value.BranchOfficeAddress,
      City: this.changeBranchForm.value.City,
      Country: this.changeBranchForm.value.Country
    }

    // RentACarServiceID je ustvari u ovom slucaj id filijale..ove sam stavio ovaj naziv da ne moram da pravim novu klasu
    // koja ce primati poruke samo zbog jednog polja

    return this.http.put(this.BaseURI + '/RentACar/ChangeBranchOffice/', body);
  }

  // metoda za ucitavanje svih automobila
  loadCars(){
    return this.http.get(this.BaseURI + '/RentACar/GetCars');
  }

  // metoda za dodavanje novog automobila
  addNewCar(){
    console.log(this.addCarForm.value.IsQuickBooking);
    var body = {
      Name: this.addCarForm.value.Name,
      Brand: this.addCarForm.value.Brand,
      Model: this.addCarForm.value.Model,
      YearOfManufacture: this.addCarForm.value.YearOfManufacture,
      NumberOfSeats: this.addCarForm.value.NumberOfSeats,
      CardType: this.addCarForm.value.CardType,
      LugageWeight: this.addCarForm.value.LugageWeight,
      IsQuickBooking: "",
      FlightID: this.addCarForm.value.Flight,
      RentACarServiceID: this.addCarForm.value.RentACarService,
    }

    if(this.addCarForm.value.IsQuickBooking){
      body.IsQuickBooking = "true";
    }
    else{
      body.IsQuickBooking = "false";
    }

    return this.http.post(this.BaseURI + '/RentACar/AddNewCar', body);
  }

  // metoda za brisanje kola
  deleteCar(carID: string){
    return this.http.delete(this.BaseURI + '/RentACar/DeleteCar/' + carID);
  }

  // dodati metodu za pormenu podataka vozila
  changeCar(){
    var body = {
      Name: this.changeCarForm.value.Name,
      Brand: this.changeCarForm.value.Brand,
      Model: this.changeCarForm.value.Model,
      YearOfManufacture: this.changeCarForm.value.YearOfManufacture,
      NumberOfSeats: this.changeCarForm.value.NumberOfSeats,
      CardType: this.changeCarForm.value.CardType,
      LugageWeight: this.changeCarForm.value.LugageWeight,
      IsQuickBooking: "",
      FlightID: this.changeCarForm.value.Flight
    }

    if(this.changeCarForm.value.IsQuickBooking){
      body.IsQuickBooking = "true";
    }
    else{
      body.IsQuickBooking = "false";
    }
    
    var carID = this.changeCarForm.value.Car;
    return this.http.put(this.BaseURI + '/RentACar/ChangeCar/' + carID, body);
  }
}
