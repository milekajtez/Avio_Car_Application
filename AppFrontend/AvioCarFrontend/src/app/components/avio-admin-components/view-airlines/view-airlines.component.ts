import { Component, OnInit, Injectable } from '@angular/core';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { Airline } from 'src/app/entities/avio-entities/airline/airline';
import { HttpClient } from '@angular/common/http';
import { Destination } from 'src/app/entities/avio-entities/destination/destination';
import { Flight } from 'src/app/entities/avio-entities/flight/flight';

declare var ol: any;

@Component({
  selector: 'app-view-airlines',
  templateUrl: './view-airlines.component.html',
  styleUrls: ['./view-airlines.component.css']
})

@Injectable()
export class ViewAirlinesComponent implements OnInit {
  airlines = new  Array<Airline>();
  destinations = new Array<Destination>();
  flights = new Array<Flight>();

  promotionDescription: string;
  priceList: string;

  additionalInfo: string;
  numberOfTransfers: string;
  allTransfers: string;
  planeName: string;
  laguageWeight: string;

  lon: number;
  lat: number;
  map: any;

  constructor(public loadService: LoadDataService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadInitializeData();
  }

  loadInitializeData(): void {
    this.loadService.loadAirlines().subscribe(
      (res: any) => {
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
            res[i].airlinePromotionDescription, res[i].airlinePriceList, res[i].numberOfSoldTickets, i + 1/*rating*/));
        }
      },
      err => {
        console.log(err);
        alert("Loading airlines is unsuccessfully.");
      }
    );
  }

  viewAirlinePromotionDescription(airline: any){
    this.promotionDescription = airline.airlinePromotionDescription;
  }

  viewAirlinePricelist(airline: any){
    this.priceList = airline.airlinePriceList;
  }

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

  // calculating location
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

  // define map
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

  // add point on map
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

  // function for deteteand add new div element in address modal
  myFunction(){
    var element = document.getElementById("map");
    element.parentNode.removeChild(element);
    var node  = document.createElement("div");
    node.setAttribute("id", "map");
    node.setAttribute("style", "height: 400px;");
    var parent = document.getElementById("destory1");
    parent.appendChild(node);
  }
  
  // ucitavanje destinacija
  viewDestinations(airline: any){
    this.destinations = [];
    this.loadService.loadDestinations(airline.airlineID).subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++){
          this.destinations.push(new Destination(res[i].airportID, res[i].airportName, res[i].city, res[i].country));
        }
      },
      err => {
        console.log(err);
        if(err.error === "Currentlly this airline not have any destinations."){
          alert("Currentlly airline not have any destinations.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }

  // ucitavanje letova
  viewFlights(airline: any){
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

  // prikaz dodatnih informacija o letu
  flightMoreInfo(flight: any){
    this.additionalInfo = flight.adittionalInformation;
    this.numberOfTransfers = flight.numberOfTransfers;
    this.allTransfers = flight.allTransfers;
    this.planeName = flight.planeName;
    this.laguageWeight = flight.laguageWeight;
  }


  airlineID: string;
  viewAirlineID(airline: any){
    this.airlineID = airline.airlineID;
  }

  // metoda za izmenu glavnih informacija aviokompanije
  changeAirlineMainInfo(){
    this.loadService.changeMainInfo(this.airlineID).subscribe(
      (res: any) => {
        this.loadService.changeAirlineMainInfo.reset();
        this.airlines  = [];
        this.loadInitializeData();
        alert("Change succesfully.");
        
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

}
