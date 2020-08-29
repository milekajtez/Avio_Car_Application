import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RegisterService } from 'src/app/services/register-and-login/register-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Airline } from 'src/app/entities/avio-entities/airline/airline';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { HttpClient } from '@angular/common/http';
import { Destination } from 'src/app/entities/avio-entities/destination/destination';
import { Flight } from 'src/app/entities/avio-entities/flight/flight';
import { AbstractFilterParam } from 'src/app/entities/abstract-filter-param/abstract-filter-param';
import { StringFilterParam } from 'src/app/entities/string-filter-param/string-filter-param';
import { NumberFilterParam } from 'src/app/entities/number-filter-param/number-filter-param';
import { FlightService } from 'src/app/services/flight/flight.service';
import { RentACarServiceComboBox } from 'src/app/entities/rent-a-car-service-combo-box/rent-a-car-service-combo-box';
import { BranchOffice } from 'src/app/entities/car-entities/branch-office/branch-office';
import { Car } from 'src/app/entities/car-entities/car/car';
import { RentACarService } from 'src/app/services/rent-a-car/rent-a-car.service';

declare var ol: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  firstLoginVariable: any;
  airlines = new Array<Airline>();
  destinations = new Array<Destination>();
  flights = new Array<Flight>();
  filteredFlights = new Array<Flight>();
  rentACarServices = new Array<RentACarServiceComboBox>();
  branchOffices = new Array<BranchOffice>();
  cars = new Array<Car>();
  filteredCars = new Array<Car>();
  lon: number;
  lat: number;
  map: any;
  promotionDescription: string;
  additionalInfo: string;
  numberOfTransfers: string;
  allTransfers: string;
  planeName: string;
  laguageWeight: string;
  yearOdManufacture: string;
  carType: string;
  lugageWeightCar: string;
  timeOfCarPurchase: string;
  isCarPurchased: string;
  isQuickBooking: string;
  carPrice: string;

  constructor(public service: RegisterService, private router: Router, private toastr: ToastrService,
    private authService: AuthService, private loadService: LoadDataService, private http: HttpClient,
    private flightService: FlightService, private carService: RentACarService) { }

  ngOnInit(): void { }

  //#region 1 - Metoda za pozivanje obicnog logovanja
  onSubmit() {
    this.service.login().subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(res.token);

        if(decodedToken.role === "regular_user") {
          this.router.navigateByUrl('/regularUserHomePage/' + this.service.formLoginModel.value.UserName);
        }
        else if(decodedToken.role === "main_admin") {
          this.router.navigateByUrl('/mainAdminHomePage/' + this.service.formLoginModel.value.UserName);
        }
        else if(decodedToken.role === "avio_admin") {
          if(decodedToken.FirstLogin === "True") {
            var tenure = prompt("This is your first login.Please enter your new password.","");
            if(tenure != null) {

              var body = {
                Id: decodedToken.primarysid,
                Password: tenure
              }
              
              this.service.changePasswordFirstLogin(body).subscribe(
                (res: any) => {
                  if (res.succeeded) {
                    alert("Changing password succesfully.");
                    this.router.navigateByUrl('/avioAdminHomePage/' + this.service.formLoginModel.value.UserName);
                  }
                },
                err => {
                  if(err.error === "Username or password is incorrect or user not confirmed registration with mail") {
                    alert("Username or password is incorrect or user not confirmed registration with mail");
                  }
                }
              );
            }
          }
          else
          {
            this.router.navigateByUrl('/avioAdminHomePage/' + this.service.formLoginModel.value.UserName);
          }
        }
        else if(decodedToken.role === "car_admin") {
          if(decodedToken.FirstLogin === "True") {
            var tenure = prompt("This is your first login.Please enter your new password.","");
            if(tenure != null) {
              console.log(tenure);

              var body = {
                Id: decodedToken.primarysid,
                Password: tenure
              }
              
              this.service.changePasswordFirstLogin(body).subscribe(
                (res: any) => {
                  if (res.succeeded) {
                    alert("Changing password succesfully.");
                    this.router.navigateByUrl('/carAdminHomePage/' + this.service.formLoginModel.value.UserName);
                  }
                },
                err => {
                  if(err.error === "Username or password is incorrect or user not confirmed registration with mail") {
                    alert("Username or password is incorrect or user not confirmed registration with mail");
                  }
                }
              );
            }
          }
          else
          {
            this.router.navigateByUrl('/carAdminHomePage/' + this.service.formLoginModel.value.UserName);
          }
        }
      },
      err => {
        if(err.error.message == "Username is incorrect."){
          alert("Username is incorrect.");
        }
        else if(err.error.message == "Password is incorrect."){
          alert("Password is incorrect.");
        }
        else if(err.error.message == "Please go to your mail accont and confirm you registration."){
          alert("Please go to your mail accont and confirm you registration.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za pozivanje logovanja preko mreze
  LoginWithGoogle(): void {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.authService.signIn(socialPlatformProvider).then(socialusers => {
      this.service.externalLogin(socialusers).subscribe((res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/regularUserHomePage/' + socialusers.name);
      });
      console.log(socialusers);
    });
  }
  //#endregion  
  //#region 3 - Metoda za pozivanje ucitavanja aviokompanija
  loadAirlines(): void {
    this.loadService.loadAirlines().subscribe(
      (res: any) => {
        this.airlines = [];
        for(var i = 0; i < res.length; i++)
        {
          var rating;
          if(res[i].numberOfAirlineGrades == "0")
          {
            rating = 0;
          }
          else
          {
            rating = Number(res[i].airlinePrice) / Number(res[i].numberOfAirlineGrades);
          }
          
          this.airlines.push(new Airline(res[i].airlineID, res[i].airlineName, res[i].airlineAddress, 
            res[i].airlinePromotionDescription, res[i].airlinePriceList, res[i].numberOfSoldTickets, rating));
        }
      },
      err => {
        console.log(err);
        alert("Loading airlines unsuccessfuly.");
      }
    );
  }
  //#endregion
  //#region 4 - Metoda za ucitavanje destinacija
  loadDestination(airline: any){
    this.destinations = [];
    this.loadService.loadDestinations(airline.airlineID).subscribe(
      (res: any) => {
        console.log(res);
        for(var i = 0; i < res.length; i++){
          this.destinations.push(new Destination(res[i].airportID, res[i].airportName, res[i].city, res[i].country));
        }
      },
      err => {
        alert("Loading airlines is unsuccessfully. This airline not have any destination.");
      }
    );
  }
  //#endregion 
  //#region 5 - Metoda za ucitavanje letova
  loadFlights(airline: any): void {
    this.filteredFlights  = [];
    this.flights = [];
    this.loadService.loadAirlineFlights(airline.airlineID).subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++){
          var rating;
          if(res[i].numberOfFlightGrades == "0"){
            rating = 0;
          }
          else{
            rating = Number(res[i].flightPrice) / Number(res[i].numberOfFlightGrades);
          }

          this.flights.push(new Flight(res[i].flightID, res[i].startTime, res[i].endTime, res[i].startLocation,
            res[i].endLocation, res[i].flightTime, res[i].flightLength, rating, res[i].additionalInformation, 
            res[i].numberOfTransfers, res[i].allTransfers, res[i].planeName, res[i].lugageWeight));
        }

        this.filteredFlights = this.flights;
      },
      err => {
        if(err.error === "Currentlly this airline not have any flight."){
          alert("Currentlly this airline not have any flight.");
        }
        else{
          alert("Unkonwn error.");
        }
      }
    );
  }
  //#endregion
  //#region 6 - Metoda za prikaz more info leta
  flightMoreInfo(flight: any) : void {
    this.additionalInfo = flight.adittionalInformation;
    this.numberOfTransfers = flight.numberOfTransfers;
    this.allTransfers = flight.allTransfers;
    this.planeName = flight.planeName;
    this.laguageWeight = flight.laguageWeight;
  }
  //#endregion
  //#region 7 - Metoda za pravljenje stringa na osnovu kojeg ce se odredjivati koordiante adrese i metoda za uvacivanje mape u modal
  viewAirlineMapAddress(airline: any){
    var address = airline.airlineAddress;
    var broj = "";
    var ulica = "";
    var grad = "";
    var identficator = false;
    var splitted = address.split(" ");

    for(var i = 0; i < splitted.length; i++){
      var n = Number(splitted[i]);
      if(n.toString() === "NaN"){
        if(identficator === false){
          ulica += splitted[i] + " ";
        }
        else{
          console.log("city");
          grad += splitted[i] + " ";
        }
      }
      else{
        broj = splitted[i];
        identficator = true;
      }
    }

    ulica = ulica.substring(0, ulica.length - 1);
    grad = grad.substring(0, grad.length - 1);
    var formatedAddress = broj + "," + ulica + "," + grad;
    this.addressLookup(formatedAddress);
  }

  myFunction(){
    var element = document.getElementById("map");
    element.parentNode.removeChild(element);
    var node  = document.createElement("div");
    node.setAttribute("id", "map");
    node.setAttribute("style", "height: 400px;");
    var parent = document.getElementById("destory1");
    parent.appendChild(node);
  }
  //#endregion
  //#region 8 - Metoda za ubacivanje podataka u modal (promotivni opis)
  viewAirlinePromotionDescription(airline: any){
    this.promotionDescription = airline.airlinePromotionDescription;
  }
  //#endregion
  //#region 9 - Metode za filtriranje letova
  filterFlights(): void {
    let filterParams = new Array<AbstractFilterParam>();
    if (this.getFilterFieldValue("startLocationFilter")) {
      filterParams.push(this.addStartLocationFilterParam());
    }
    if (this.getFilterFieldValue("endLocationFilter")) {
      filterParams.push(this.addEndLocationFilterParam());
    }
    if (this.getFilterFieldValue("flightRatingFilter")) {
      filterParams.push(this.addFlightRatingFilterParam());
    }

    this.filteredFlights = this.flightService.filterFlights(this.flights, filterParams);
  }

  resetFilter(): void {
    this.filteredFlights = this.flights;
  }

  getFilterFieldValue(filterFieldId: string){
    return (<HTMLInputElement> document.getElementById(filterFieldId)).value;
  }

  addStartLocationFilterParam(): ReturnType<any> {
    return new StringFilterParam("startLocationFilter", this.getFilterFieldValue("startLocationFilter"));
  }

  addEndLocationFilterParam(): ReturnType<any> {
    return new StringFilterParam("endLocationFilter", this.getFilterFieldValue("endLocationFilter"));
  }

  addFlightRatingFilterParam(): ReturnType<any> {
    return new NumberFilterParam("flightRatingFilter", +this.getFilterFieldValue("flightRatingFilter"));
  }
  //#endregion
  //#region 10 - Metoda za ucitavanje rent-a-car servisa
  loadRentACarServices(): void {
    this.rentACarServices = [];
    this.carService.loadRentACarServices().subscribe(
      (res: any) => {
        console.log(res);
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
  //#endregion
  //#region 11 - Metoda za ucitavanje filijala
  loadBranchOffices(service: any): void {
    this.branchOffices = [];
    this.carService.loadRentACarServiceBranchOffices(service.carServiceID).subscribe(
      (res: any) => {
        this.branchOffices = [];
        for(var i = 0; i < res.length; i++){
          this.branchOffices.push(new BranchOffice(res[i].branchOfficeID, res[i].branchOfficeAddress, res[i].city, 
            res[i].country));
        }
      },
      err => {
        alert("Loading branch office unsuccessfuly.");
      }
    );
  }
  //#endregion
  //#region 12 - Metoda za ucitavanje kola
  loadcars(service: any): void {
    this.cars = [];
    this.carService.loadRentACarServiceCars(service.carServiceID).subscribe(
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

          this.filteredCars = this.cars;
        }
      },
      err => {
        if(err.error === "Currentlly this rent-a-car service not have any cars."){
          alert("Currentlly this rent-a-car service not have any cars.");
          this.filteredCars = [];
        }
        else{
          alert("Unkonwn error.");
        }
      }
    );
  }
  //#endregion
  //#region 13 - More info za car
  viewCarMoreInfo(car: any){
    this.yearOdManufacture = car.yearOdManufacture;
    this.carType = car.carType;
    this.lugageWeightCar = car.lugageWeight;
    this.timeOfCarPurchase = car.timeOfCarPurchase;
    this.isCarPurchased = car.isCarPurchased;
    this.isQuickBooking = car.isQuickBooking;
    this.carPrice = car.carPrice;
  }
  //#endregion
  //#region 14 - Metoda za pravljenje stringa adrese i metoda za ubacivanje mape u modal
  viewRentACarMapAddress(service: any){
    var address = service.carServiceAddress;
    var broj = "";
    var ulica = "";
    var grad = "";
    var identficator = false;
    var splitted = address.split(" ");

    for(var i = 0; i < splitted.length; i++){
      var n = Number(splitted[i]);
      if(n.toString() === "NaN"){
        if(identficator === false){
          ulica += splitted[i] + " ";
        }
        else{
          console.log("city");
          grad += splitted[i] + " ";
        }
      }
      else{
        broj = splitted[i];
        identficator = true;
      }
    }

    ulica = ulica.substring(0, ulica.length - 1);
    grad = grad.substring(0, grad.length - 1);
    var formatedAddress = broj + "," + ulica + "," + grad;
    this.addressLookup(formatedAddress);
  }

  myFunctionCar(){
    var element = document.getElementById("map");
    element.parentNode.removeChild(element);
    var node  = document.createElement("div");
    node.setAttribute("id", "map");
    node.setAttribute("style", "height: 400px;");
    var parent = document.getElementById("destory1Car");
    parent.appendChild(node);
  }
  //#endregion
  //#region 15 - Metoda za ubacivanje podatak u modal (prmotivni opis)
  viewRentACarPromotionDescription(service: any){
    this.promotionDescription = service.carServicePromotionDescription;
  }
  //#endregion
  //#region 16 - Metoda za filtriranje automobila
  filterCars(): void {
    let filterParams = new Array<AbstractFilterParam>();
    if (this.getFilterFieldValue("carNameFilter")) {
      filterParams.push(this.addCarNameFilterParam());
    }
    if (this.getFilterFieldValue("numberOfSeatsFilter")) {
      filterParams.push(this.addNumberOfSeatsFilterParam());
    }
    if (this.getFilterFieldValue("carRatingFilter")) {
      filterParams.push(this.addCarRatingFilterParam());
    }

    this.filteredCars = this.carService.filterCars(this.cars, filterParams);
  }

  addCarNameFilterParam(): ReturnType<any> {
    return new StringFilterParam("carNameFilter", this.getFilterFieldValue("carNameFilter"));
  }

  addNumberOfSeatsFilterParam(): ReturnType<any> {
    return new NumberFilterParam("numberOfSeatsFilter", +this.getFilterFieldValue("numberOfSeatsFilter"));
  }

  addCarRatingFilterParam(): ReturnType<any> {
    return new NumberFilterParam("carRatingFilter", +this.getFilterFieldValue("carRatingFilter"));
  }

  resetFilterCar(){
    this.filteredCars = this.cars;
  }
  //#endregion
  //#region 17 - Metode za racunanje koordinata, inicijalizaciju mape i markera
  addressLookup(formatedAddress: string) : void {
    var splited = formatedAddress.split(",", 3);
    var houseNumber = (splited[0]).replace(' ', '%20');
    var street = (splited[1]).replace(' ', '%20');
    var city = (splited[2]).replace(' ', '%20');

    var location = 'street=' + houseNumber + '+' + street + '&city=' + city;
    var search = 'http://nominatim.openstreetmap.org/search?format=json&' + location;

    this.http.get(search, {responseType: 'text'}).subscribe(
      (res: any) => {
        res = JSON.parse(res);

        this.lon = 0;
        this.lat = 0;
        this.lon = res[0].lon;
        this.lat = res[0].lat;

        this.defineMap(res[0].lon, res[0].lat);
      }
    );
  }

  defineMap(longitude: any, latitude: any){
    console.log("definisanje mape");
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([longitude - 0.00, latitude - 0.00]),
        zoom: 15
      })
    });

    this.addPoint(latitude  - 0.00, longitude - 0.00);
  }

  addPoint(lat: number, lng: number) {
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
        })]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: 'http://maps.gstatic.com/intl/de_de/mapfiles/ms/micons/red-pushpin.png'
        })
      })
    });

    this.map.addLayer(vectorLayer);
  }
  //#endregion
}
