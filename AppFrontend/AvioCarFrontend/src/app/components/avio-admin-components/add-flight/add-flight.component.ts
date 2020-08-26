import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight/flight.service';
import { AirlineComboBox } from 'src/app/entities/airline-combo-box/airline-combo-box';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { FlightComboBox } from 'src/app/entities/flight-combo-box/flight-combo-box';

@Component({
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css']
})
export class AddFlightComponent implements OnInit {
  airlines = new  Array<AirlineComboBox>();
  flights = new Array<FlightComboBox>()

  constructor(public service: FlightService, public loadService: LoadDataService) { }

  ngOnInit(): void {
    this.loadInitializeData();
    this.loadFlightsData();
  }

  //#region 1 - Metoda za ucitavanje avio kompanija
  loadInitializeData(): void {
    this.loadService.loadAirlines().subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++){
          this.airlines.push(new AirlineComboBox(res[i].airlineID, res[i].airlineName, res[i].airlineAddress));
        }
      },
      err => {
        console.log(err);
        alert("Loading airlines failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za ucitavanje letova
  loadFlightsData(): void {
    this.flights = [];
    this.loadService.loadFlights().subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++){
          this.flights.push(new FlightComboBox(res[i].flightID, res[i].planeName, res[i].startLocation, res[i].endLocation));
        }
      },
      err => {
        console.log(err);
        alert("Loading flights failed.");
      }
    );
  }
  //#endregion
  //#region 3 - Metoda za dodavanje novog leta
  onSubmit(): void {
    this.service.addNewFlight().subscribe(
      (res: any) => {
        alert("Adding flight successfully.");
        this.service.newFlightForm.reset();
        this.flights = [];
        this.loadFlightsData();
      },
      err => {
        console.log(err);
        if(err.error === "Add flight is unsuccessffully.Server not found selected airline."){
          alert("Adding flight failed.Server not found selected airline.");
        }
        else if(err.error === "Add flight is unsuccessffully. You entered same time for start and end od flight."){
          alert("Adding flight failed. You entered same time for start and end od flight.");
        }
        else if(err.error === "Add flight is unsuccessffully. Time of flight end is earlier than time of flight start."){
          alert("Adding flight faild. Time of flight end is earlier than time of flight start.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
  //#region 4 - Metoda za brisanje leta
  deleteSubmit(){
    this.loadService.deleteFlight(this.loadService.deleteFlightForm.value.Flight).subscribe(
      (res: any) => {
        alert("Deleting flight successfully.");
        this.flights = [];
        this.loadFlightsData();
      },
      err => {
        alert("Deleting flight failed.");
      }
    );
  }
  //#endregion
  //#region 5 - MEtoda za izmenu eta
  changeSubmit(){
    this.loadService.changeFlight().subscribe(
      (res: any) => {
        alert("Changing flight succesfully.");
        this.flights = [];
        this.loadFlightsData();
        this.loadService.changeFlightForm.reset();
      },
      err => {
        if(err.error === "Change flight unsuccessfully. You not enter any new informations."){
          alert("Changing flight unsuccessfully. You not enter any new informations.");
        }
        else if(err.error === "Change flight is unsuccessffully. You entered same time for start and end od flight."){
          alert("Changing flight failed. You entered same time for start and end od flight.");
        }
        else if(err.error === "Change flight is unsuccessffully. Time of flight end is earlier than time of flight start."){
          alert("Changing flight failed. Time of flight end is earlier than time of flight start.");
        }
        else if(err.error === "If you insert one time, you must isert and another.Change unccessfully."){
          alert("If you insert one time, you must insert and another. Changing flight failed.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
}
