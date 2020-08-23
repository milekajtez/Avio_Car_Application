import { Component, OnInit } from '@angular/core';
import { RentACarService } from 'src/app/services/rent-a-car/rent-a-car.service';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { Flight } from 'src/app/entities/avio-entities/flight/flight';
import { Car } from 'src/app/entities/car-entities/car/car';
import { RentACarServiceComboBox } from 'src/app/entities/rent-a-car-service-combo-box/rent-a-car-service-combo-box';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {
  flights = new Array<Flight>();
  cars = new Array<Car>();
  rentACarServices = new Array<RentACarServiceComboBox>();

  constructor(public service: RentACarService, public loadService: LoadDataService) { }

  ngOnInit(): void {
    this.initializeCarsData();
    this.initializeRentACarServiceData();
    this.initializeLoadFlightsData();
  }

  initializeCarsData(): void {
    this.service.loadCars().subscribe(
      (res: any) => {
        console.log(res);
        for(var i = 0; i < res.length; i++){
          var rating;
          if(res[i].numberOfCarGrades == "0"){
            rating = 0;
          }
          else{
            rating = Number(res[i].overallGrade) / Number(res[i].numberOfCarGrades);
          }

          var carType;
          if(res[i].carType == "0"){
            carType = "GASOLINE";
          }
          else if(res[i].carType == "1"){
            carType = "DIESEL";
          }
          else{
            carType = "GAS";
          }

          this.cars.push(new Car(res[i].carID, res[i].carName, res[i].carBrand, res[i].carModel, res[i].yearOdManufacture,
            res[i].numberOfSeats, carType, rating, res[i].lugageWeight, res[i].timeOfCarPurchase, 
            res[i].isCarPurchased, res[i].isQuickBooking, res[i].carPrice));
        }
      },
      err => {
        console.log(err);
        alert("Loading rent-a-car services is unsuccessfully.");
      }
    );
  }

  initializeRentACarServiceData(): void {
    this.service.loadRentACarServices().subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++){
          var rating;
          if(res[i].numberOfCarServiceGrades == "0"){
            rating = 0;
          }
          else{
            rating = Number(res[i].carServicePrice) / Number(res[i].numberOfCarServiceGrades);
          }

          this.rentACarServices.push(new RentACarServiceComboBox(res[i].carServiceID, res[i].carServiceName, 
            res[i].carServiceAddress, res[i].carServicePromotionDescription, rating, res[i].servicePriceList, 
            res[i].serviceEarnings));
        }
      },
      err => {
        console.log(err);
        alert("Loading rent-a-car services is unsuccessfully.");
      }
    );
  }

  initializeLoadFlightsData(): void {
    this.loadService.loadFlights().subscribe(
      (res: any) => {
        console.log(res);
        var rating;
        for(var i = 0; i < res.length; i++){
          if(res[i].numberOfFlightGrades === "0"){
            rating = 0;
          }
          else{
            rating = Number(res[i].flightPrice) / Number(res[i].numberOfFlightGrades);
          }

          this.flights.push(new Flight(res[i].flightID, res[i].startTime, res[i].endTime, res[i].startLocation,
            res[i].endLocation, res[i].flightTime, res[i].flightLength, rating, res[i].additionalInformation, 
            res[i].numberOfTransfers, res[i].allTransfers, res[i].planeName, res[i].lugageWeight));
        }
      },
      err => {
        console.log(err);
        alert("Loading flights is unsuccessfully.");
      }
    );
  }

  addSubmit(): void {
    this.service.addNewCar().subscribe(
      (res: any) => {
        this.cars = [];
        this.initializeRentACarServiceData();
        this.initializeCarsData();
        alert("Car added successfully.");
        this.service.addCarForm.reset();
      },
      err => {
        console.log(err);
        if(err.error === "Add car unsuccessfuly. Server not found entered rent-a-car service"){
          alert("Add car unsuccessfuly. Server not found entered rent-a-car service.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }

  deleteSubmit(): void {
    this.service.deleteCar(this.service.deleteCarForm.value.Car).subscribe(
      (res: any) => {
        alert("Deleting car successfully.");
        this.cars = [];
        this.initializeCarsData();
      },
      err => {
        if(err.error === "Car is currently purchased. Delete unsuccessfuly."){
          alert("Car is currently purchased. Delete unsuccessfuly.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }

  changeSubmit(): void {
    // TO DO: izmeniti
    this.service.changeCar().subscribe(
      (res: any) => {
        alert("Successfully chage car.");
        this.cars = [];
        this.initializeCarsData();
        this.service.changeCarForm.reset();
      },
      err => {
        if(err.error === "Changing unsuccessfuly. Server Not found selectred flight."){
          alert("Changing unsuccessfuly. Server Not found selectred flight.");
        }
        else if(err.error === "Changing is unsuccessfuly. Server not found selected car."){
          alert("Changing is unsuccessfuly. Server not found selected car.");
        }
        else{
          alert("Unknown error.");
        } 
      }
    );
  }

}
