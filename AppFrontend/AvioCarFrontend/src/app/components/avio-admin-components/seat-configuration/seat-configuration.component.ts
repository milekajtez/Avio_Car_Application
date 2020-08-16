import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight/flight.service';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { FlightComboBox } from 'src/app/entities/flight-combo-box/flight-combo-box';

@Component({
  selector: 'app-seat-configuration',
  templateUrl: './seat-configuration.component.html',
  styleUrls: ['./seat-configuration.component.css']
})
export class SeatConfigurationComponent implements OnInit {
  flights =  new  Array<FlightComboBox>();

  constructor(public service: FlightService, public loadService: LoadDataService) { }

  ngOnInit(): void {
    this.initializeFlightsData();
  }

  initializeFlightsData(): void {
    this.loadService.loadFlights().subscribe(
      (res: any) => {
        console.log(res);
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
    this.service.addNewSeatsConfiguration().subscribe(
      (res: any) => {
        alert("Seats configuration is successfully.");
        this.service.aircraftSeatForm.reset();
      },
      err => {
        if(err.error === "Add seact configuration is unsuccessffully.Server not found selected flight."){
          alert("Add seact configuration is unsuccessffully.Server not found selected flight.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
}
