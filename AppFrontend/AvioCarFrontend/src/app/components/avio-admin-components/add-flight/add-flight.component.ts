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

  loadInitializeData(): void {
    this.loadService.loadAirlines().subscribe(
      (res: any) => {
        console.log(res);
        for(var i = 0; i < res.length; i++){
          this.airlines.push(new AirlineComboBox(res[i].airlineID, res[i].airlineName, res[i].airlineAddress));
        }
      },
      err => {
        console.log(err);
        alert("Loading airlines is unsuccessfully.");
      }
    );
  }

  loadFlightsData(): void {
    // pozivanje ucitavanja letova
    this.flights = [];
    this.loadService.loadFlights().subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++){
          this.flights.push(new FlightComboBox(res[i].flightID, res[i].planeName, res[i].startLocation, res[i].endLocation));
        }
      },
      err => {
        console.log(err);
        alert("Loading airlines is unsuccessfully.");
      }
    );
  }
  
  onSubmit(): void {
    this.service.addNewFlight().subscribe(
      (res: any) => {
        alert("Flight added successfully.");
        this.service.newFlightForm.reset();
        this.flights = [];
        this.loadFlightsData();
      },
      err => {
        console.log(err);
        if(err.error === "Add flight is unsuccessffully.Server not found selected airline."){
          alert("Add flight is unsuccessffully.Server not found selected airline.");
        }
        else if(err.error === "Add flight is unsuccessffully. You entered same time for start and end od flight."){
          alert("Add flight is unsuccessffully. You entered same time for start and end od flight.");
        }
        else if(err.error === "Add flight is unsuccessffully. Time of flight end is earlier than time of flight start."){
          alert("Add flight is unsuccessffully. Time of flight end is earlier than time of flight start.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }

  deleteSubmit(){
    this.loadService.deleteFlight(this.loadService.deleteFlightForm.value.Flight).subscribe(
      (res: any) => {
        alert("Deleting flight successfully.");
        this.flights = [];
        this.loadFlightsData();
      },
      err => {
        alert("Deleting destination is unsuccessfully.");
      }
    );
  }

  changeSubmit(){
    this.loadService.changeFlight().subscribe(
      (res: any) => {
        alert("Successfull change flihgt.");
        this.flights = [];
        this.loadFlightsData();
        this.loadService.changeFlightForm.reset();
      },
      err => {
        if(err.error === "Change flight unsuccessfully. You not enter any new informations."){
          alert("Change flight unsuccessfully. You not enter any new informations.");
        }
        else if(err.error === "Change flight is unsuccessffully. You entered same time for start and end od flight."){
          alert("Change flight is unsuccessffully. You entered same time for start and end od flight.");
        }
        else if(err.error === "Change flight is unsuccessffully. Time of flight end is earlier than time of flight start."){
          alert("Change flight is unsuccessffully. Time of flight end is earlier than time of flight start.");
        }
        else if(err.error === "If you insert one time, you must isert and another.Change unccessfully."){
          alert("If you insert one time, you must insert and another.Change unccessfully.");
        }
        else{
          alert("Unknown error.");
        }
        
      }
    );
  }

}
