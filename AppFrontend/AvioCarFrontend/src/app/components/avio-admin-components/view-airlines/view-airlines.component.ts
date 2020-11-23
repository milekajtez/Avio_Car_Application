import { Component, OnInit, Injectable } from '@angular/core';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { Airline } from 'src/app/entities/avio-entities/airline/airline';
import { HttpClient } from '@angular/common/http';
import { Destination } from 'src/app/entities/avio-entities/destination/destination';
import { Flight } from 'src/app/entities/avio-entities/flight/flight';
import { Chart } from 'node_modules/chart.js';
import { Ticket } from 'src/app/entities/avio-entities/ticket/ticket';
import { ReservationHistoryComponent } from '../../regular-user-components/reservation-history/reservation-history.component';

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

  numberOfSoldTickets: number;

  // for hours
  hours0_4: number;
  hours4_8: number;
  hours8_12: number;
  hours12_16: number;
  hours16_20: number;
  hours20_0: number;

  // for days
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;

  // for mounts
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  juni: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;

  purchasedTickets = new Array<Ticket>();

  constructor(public loadService: LoadDataService, private http: HttpClient) {
    this.initData();
   }

  ngOnInit(): void {
    this.loadInitializeData();
  }

  //#region 1 - Metoda za ucitavanje aviokompanija
  loadInitializeData(): void {
    this.loadService.loadAirlines().subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++)
        {
          var rating: number;
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
        alert("Loading airlines failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za ucitavanje destinacija
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
  //#endregion
  //#region 3 - Metoda za ucitavanje letova
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
  //#endregion
  //#region 4 - Metoda za ubacivanje podataka u modal (promotivni opis i cenovnik)
  viewAirlinePromotionDescription(airline: any){
    this.promotionDescription = airline.airlinePromotionDescription;
  }

  viewAirlinePricelist(airline: any){
    this.priceList = airline.airlinePriceList;
  }
  //#endregion
  //#region 5 - Metoda za podesavanje stringa adrese, pronalazak koordinata adrese, inicijalizaciju mape i markera i metoda za postavljanje mape u modal
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

  addressLookup(formatedAddress: string) : void {
    if(formatedAddress.charAt(0) === ","){
      formatedAddress = formatedAddress.substring(1,formatedAddress.length - 1);
    }
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
  //#region 6 - Metoda za prikaz dodatnih informacija o letu
  flightMoreInfo(flight: any){
    this.additionalInfo = flight.adittionalInformation;
    this.numberOfTransfers = flight.numberOfTransfers;
    this.allTransfers = flight.allTransfers;
    this.planeName = flight.planeName;
    this.laguageWeight = flight.laguageWeight;
  }
  //#endregion
  //#region 7 - Metoda za izvlacenje id aviokompanije i izmenu glavnih informacija iste
  airlineID: string;
  viewAirlineID(airline: any){
    this.airlineID = airline.airlineID;
  }

  changeAirlineMainInfo(){
    this.loadService.changeMainInfo(this.airlineID).subscribe(
      (res: any) => {
        this.loadService.changeAirlineMainInfo.reset();
        this.airlines  = [];
        this.loadInitializeData();
        alert("Changing airline succesfully.");
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
  //#region 8 - Metoda za definiciju grafika u modal
  drawChart(airline: any){
    this.numberOfSoldTickets = airline.numberOfSoldTickets;
    this.loadService.loadPurchasedTickets(airline.airlineID).subscribe(
      (res: any) => {
        this.purchasedTickets = [];
        for(var i = 0; i < res.length; i++){
          var type: string;
          if(res[i].cardType == "0"){
            type = "ECONOMIC";
          }
          else if(res[i].cardType == "1"){
            type = "FIRST";
          }
          else{
            type = "BUSINESS";
          }

          this.purchasedTickets.push(new Ticket(res[i].ticketID, res[i].ticketNumber, res[i].ticketPrice, type, res[i].timeOfTicketPurchase,
            res[i].isTicketPurchased, res[i].isQuickBooking));
        }
        
        this.initData();
        this.defineChartsData();

        var myChart1 = new Chart("myChart1", { 
          type: 'bar',
          data: {
            labels: ["00:00 - 04:00", "04:00 - 08:00", "08:00 - 12:00", "12:00 - 16:00", "16:00 - 20:00", "20:00 - 00:00"],
            datasets: [{
              label: '# of sold tickets (hours)',
              data: [this.hours0_4, this.hours4_8, this.hours8_12, this.hours12_16, this.hours16_20, this.hours20_0],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

        var myChart2 = new Chart("myChart2", { 
          type: 'bar',
          data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            datasets: [{
              label: '# of sold tickets (days)',
              data: [this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

        var myChart3 = new Chart("myChart3", { 
          type: 'bar',
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [{
              label: '# of sold tickets (days)',
              data: [this.january, this.february, this.march, this.april, this.may, this.juni, this.july, this.august, this.september, this.october, this.november, this.december],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

      },
      err => {
        console.log(err);
        if(err.error === "Loading failed. Server not found any flight."){
          alert("Loading failed. Server not found any flight.");
        }
        else if(err.error === "Loading failed. Server not found any ticket."){
          alert("Loading failed. Server not found any ticket.");
        }
        else if(err.error === "This airline not have any purchased ticket yet."){
          alert("This airline not have any purchased ticket yet.");
        }
        else{
          alert("Unknown error.");
        }

        this.initData();
        this.purchasedTickets = [];

        var chart1 = document.getElementById("myChart1");
        chart1.remove();
        var chart2 = document.getElementById("myChart2");
        chart2.remove();
        var chart3 = document.getElementById("myChart3");
        chart3.remove();
        
        var newChart1 = document.createElement("CANVAS");
        newChart1.id = "myChart1";
        newChart1.style.maxWidth = "500px";
        document.getElementById("parent1").appendChild(newChart1);
        
        var newChart2 = document.createElement("CANVAS");
        newChart2.id = "myChart2";
        newChart2.style.maxWidth = "500px";
        document.getElementById("parent2").appendChild(newChart2);

        var newChart3 = document.createElement("CANVAS");
        newChart3.id = "myChart3";
        newChart3.style.maxWidth = "500px";
        document.getElementById("parent3").appendChild(newChart3);

        var myChart1 = new Chart("myChart1", { 
          type: 'bar',
          data: {
            labels: ["00:00 - 04:00", "04:00 - 08:00", "08:00 - 12:00", "12:00 - 16:00", "16:00 - 20:00", "20:00 - 00:00"],
            datasets: [{
              label: '# of sold tickets (hours)',
              data: [this.hours0_4, this.hours4_8, this.hours8_12, this.hours12_16, this.hours16_20, this.hours20_0],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

        var myChart2 = new Chart("myChart2", { 
          type: 'bar',
          data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            datasets: [{
              label: '# of sold tickets (days)',
              data: [this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

        var myChart3 = new Chart("myChart3", { 
          type: 'bar',
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [{
              label: '# of sold tickets (days)',
              data: [this.january, this.february, this.march, this.april, this.may, this.juni, this.july, this.august, this.september, this.october, this.november, this.december],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      }
    );
  }
  //#endregion
  //#region 9 - Metoda za unosenje podataka u promenljive za grafik
  defineChartsData(){
    this.purchasedTickets.forEach(element => {
      let newDate = new Date(element.timeOfTicketPurchase);
      var day = newDate.getDay();
      if(day == 1){
        this.monday += 1;
      }
      else if(day == 2){
        this.tuesday += 1;
      }
      else if(day == 3){
        this.wednesday += 1;
      }
      else if(day == 4){
        this.thursday += 1;
      }
      else if(day == 5){
        this.friday += 1;
      }
      else if(day == 6){
        this.saturday += 1;
      }
      else{
        this.sunday += 1;
      }

      var hour = newDate.getHours();
      if(hour >= 0 && hour < 4){
        this.hours0_4 += 1;
      }
      else if(hour >= 4 && hour < 8){
        this.hours4_8 += 1;
      }
      else if(hour >= 8 && hour < 12){
        this.hours8_12 += 1;
      }
      else if(hour >= 12 && hour < 16){
        this.hours12_16 += 1;
      }
      else if(hour >= 16 && hour < 20){
        this.hours16_20 += 1;
      }
      else{
        this.hours20_0 += 1;
      }

      var month = newDate.getMonth();
      if(month == 0){
        this.january += 1;
      }
      else if(month == 1){
        this.february += 1;
      }
      else if(month == 2){
        this.march += 1;
      }
      else if(month == 3){
        this.april += 1;
      }
      else if(month == 4){
        this.may += 1;
      }
      else if(month == 5){
        this.juni += 1;
      }
      else if(month == 6){
        this.july += 1;
      }
      else if(month == 7){
        this.august += 1;
      }
      else if(month == 8){
        this.september += 1;
      }
      else if(month == 9){
        this.october += 1;
      }
      else if(month == 10){
        this.november += 1;
      }
      else{
        this.december +=1;
      }
    });
  }
  //#endregion
  //#region 10 - Inicjializacija promenljivih za grafik
  initData(){
    this.hours0_4 = 0;
    this.hours4_8 = 0;
    this.hours8_12 = 0;
    this.hours12_16 = 0;
    this.hours16_20 = 0;
    this.hours20_0 = 0;
    this.monday = 0;
    this.tuesday = 0;
    this.wednesday = 0;
    this.thursday = 0;
    this.friday = 0;
    this.saturday = 0;
    this.sunday = 0;
    this.january = 0;
    this.february = 0;
    this.march = 0;
    this.april = 0;
    this.may = 0;
    this.juni = 0;
    this.july = 0;
    this.august = 0;
    this.september = 0;
    this.october = 0;
    this.november = 0;
    this.december = 0;
  }
  //#endregion
}
