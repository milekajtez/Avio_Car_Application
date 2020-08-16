import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight/flight.service';
import { AirlineComboBox } from 'src/app/entities/airline-combo-box/airline-combo-box';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';

@Component({
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css']
})
export class AddFlightComponent implements OnInit {
  airlines = new  Array<AirlineComboBox>();

  constructor(public service: FlightService, public loadService: LoadDataService) { }

  ngOnInit(): void {
    this.loadInitializeData();
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
  
  onSubmit(): void {
    this.service.addNewFlight().subscribe(
      (res: any) => {
        alert("Flight added successfully.");
        this.service.newFlightForm.reset();
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

}
