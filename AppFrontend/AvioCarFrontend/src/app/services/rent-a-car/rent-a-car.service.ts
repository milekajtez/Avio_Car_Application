import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Car } from 'src/app/entities/car-entities/car/car';
import { AbstractFilterParam } from 'src/app/entities/abstract-filter-param/abstract-filter-param';
import { StringFilterParam } from 'src/app/entities/string-filter-param/string-filter-param';
import { NumberFilterParam } from 'src/app/entities/number-filter-param/number-filter-param';

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
    CarPrice: ['', [Validators.required, Validators.pattern("[0-9]+")]],
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
    CarPrice: ['', Validators.pattern("[0-9]+")],
    Flight: ['']
  });

  changeRentACarMainInfoForm = this.fb.group({
    CarServiceName: [''],
    CarServiceAddress: [''],
    CarServicePromotionDescription: [''],
    ServicePriceList: ['']
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

  // metoda za ucitavanje kola oredjenog rent-a-car servisa--novo
  loadRentACarServiceCars(serviceID: string){
    return this.http.get(this.BaseURI + '/RentACar/GetRentACarServiceCars/' + serviceID);
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
      CarPrice: this.addCarForm.value.CarPrice,
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
      CarPrice: this.addCarForm.value.CarPrice,
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

  changeMainInfo(serviceID: string){
    var body = {
      CarServiceName: this.changeRentACarMainInfoForm.value.CarServiceName,
      CarServiceAddress: this.changeRentACarMainInfoForm.value.CarServiceAddress,
      CarServicePromotionDescription: this.changeRentACarMainInfoForm.value.CarServicePromotionDescription,
      ServicePriceList: this.changeRentACarMainInfoForm.value.ServicePriceList
    }

    return this.http.put(this.BaseURI + '/RentACar/ChangeRentACar/' + serviceID, body);
  }


  
  checkCarNameFilter(car: Car, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof StringFilterParam && filterParam.getFilterParamName() === 'carNameFilter' && !car.carName.toLowerCase().includes(filterParam.getFilterParamValue().toLowerCase());
  }
  
  checkNumberOfSeatsFilter(car: Car, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof NumberFilterParam && filterParam.getFilterParamName() === 'numberOfSeatsFilter' && !(Number(car.numberOfSeats) == filterParam.getFilterParamValue());
  }
  
  checkCarRatingFilter(car: Car, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof NumberFilterParam && filterParam.getFilterParamName() === 'carRatingFilter' && !(Number(car.carRating) == filterParam.getFilterParamValue());
  }

  // metoda za filtriranje kola
  filterCars(cars: Car[], filterParams: AbstractFilterParam[]): Car[] {
    let filteredCars = new Array<Car>();
    for (const car of cars) {
      let addCar = true;
      for (const filterParam of filterParams) {
        if (this.checkCarNameFilter(car, filterParam) || this.checkNumberOfSeatsFilter(car, filterParam)
        || this.checkCarRatingFilter(car, filterParam)){
          addCar = false;
        }
      }

      if (addCar){
        filteredCars.push(car);
      }
    }

    return filteredCars;
  }
}
