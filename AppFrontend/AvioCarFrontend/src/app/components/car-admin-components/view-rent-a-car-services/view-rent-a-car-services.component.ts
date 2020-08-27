import { Component, OnInit, Injectable } from '@angular/core';
import { FlightService } from 'src/app/services/flight/flight.service';
import { HttpClient } from '@angular/common/http';
import { RentACarServiceComboBox } from 'src/app/entities/rent-a-car-service-combo-box/rent-a-car-service-combo-box';
import { RentACarService } from 'src/app/services/rent-a-car/rent-a-car.service';
import { BranchOffice } from 'src/app/entities/car-entities/branch-office/branch-office';
import { Car } from 'src/app/entities/car-entities/car/car';
import { FlightComboBox } from 'src/app/entities/flight-combo-box/flight-combo-box';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';

declare var ol: any;

@Component({
  selector: 'app-view-rent-a-car-services',
  templateUrl: './view-rent-a-car-services.component.html',
  styleUrls: ['./view-rent-a-car-services.component.css']
})

@Injectable()
export class ViewRentACarServicesComponent implements OnInit {
  rentACarServices = new Array<RentACarServiceComboBox>();
  branchOffices = new Array<BranchOffice>();
  cars = new Array<Car>();
  flights = new Array<FlightComboBox>();
  promotionDescription: string;
  priceList: string;
  yearOdManufacture: string;
  carType: string;
  lugageWeight: string;
  timeOfCarPurchase: string;
  isCarPurchased: string;
  isQuickBooking: string;
  carPrice: string;
  lon: number;
  lat: number;
  map: any;

  constructor(public service: RentACarService, private http: HttpClient, public loadService: LoadDataService) { }

  ngOnInit(): void {
    this.initializeRentACarServicesData();
  }

  //#region 1 - Metoda za ucitavanje rent-a-car servisa
  initializeRentACarServicesData(): void {
    this.service.loadRentACarServices().subscribe(
      (res: any) => {
        console.log(res);
        for(var i = 0; i < res.length; i++){
          var rating: number;
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
        alert("Loading rent-a-car services failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za ucitavanje filijala odredjenog rent-a-car servisa
  viewBranchOffices(service: any){
    this.service.loadRentACarServiceBranchOffices(service.carServiceID).subscribe(
      (res: any) => {
        this.branchOffices = [];
        for(var i = 0; i < res.length; i++){
          this.branchOffices.push(new BranchOffice(res[i].branchOfficeID, res[i].branchOfficeAddress, res[i].city, 
            res[i].country));
        }
      },
      err => {
        alert("Loading branch office failed.");
      }
    );
  }
  //#endregion
  //#region 3 - Metoda za ucitavanje kola odredjenog rent-a-car servisa
  viewCars(service: any){
    this.cars = [];
    this.service.loadRentACarServiceCars(service.carServiceID).subscribe(
      (res: any) => {
        console.log(res);
        for(var i = 0; i < res.length; i++){
          var rating: number;
          if(res[i].numberOfCarGrades == "0"){
            rating = 0;
          }
          else{
            rating = Number(res[i].overallGrade) / Number(res[i].numberOfCarGrades);
          }

          var carType: string;
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
            res[i].numberOfSeats, carType, rating.toString(), res[i].lugageWeight, res[i].timeOfCarPurchase, 
            res[i].isCarPurchased, res[i].isQuickBooking, res[i].carPrice));
        }
      },
      err => {
        if(err.error === "Currentlly this rent-a-car service not have any cars."){
          alert("Currentlly this rent-a-car service not have any cars.");
        }
        else{
          alert("Unkonwn error.");
        }
      }
    );
  }
  //#endregion
  //#region 4 - Metoda za formatiranje stringa adrese, pronalazak koordinata, inicijalicaciju mape i markera i metoda za postavljanje mape u modal
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
  //#region 5 - Metoda za ubacivanje podataka u modal (destanacija i cenovnik)
  viewRentACarPromotionDescription(service: any){
    this.promotionDescription = service.carServicePromotionDescription;
  }

  viewRentACarPricelist(service: any){
    this.priceList = service.servicePriceList;
  }
  //#endregion
  //#region 6 - Metoda za ispis dodatnih podataka kola
  viewCarMoreInfo(car: any){
    this.yearOdManufacture = car.yearOdManufacture;
    this.carType = car.carType;
    this.lugageWeight = car.lugageWeight;
    this.timeOfCarPurchase = car.timeOfCarPurchase;
    this.isCarPurchased = car.isCarPurchased;
    this.isQuickBooking = car.isQuickBooking;
    this.carPrice = car.carPrice;
  }
  //#endregion
  //#region 7 - Metoda za ucitavanje id-ja rent-a-car servisa i menjanje osnovnih informacija istog
  serviceID: string;
  viewRentACarID(service: any){
    this.serviceID = service.carServiceID;
  }

  changeRentACarMainInfo(){
    this.service.changeMainInfo(this.serviceID).subscribe(
      (res: any) => {
        this.loadService.changeAirlineMainInfo.reset();
        this.rentACarServices  = [];
        this.initializeRentACarServicesData();
        this.service.changeRentACarMainInfoForm.reset();
        alert("Changiing airline succesfully.");
        
      },
      err => {
        if(err.error === "You not entered any new data."){
          alert("You not entered any new data.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
}
