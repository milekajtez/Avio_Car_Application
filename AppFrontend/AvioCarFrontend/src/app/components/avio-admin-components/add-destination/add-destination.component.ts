import { Component, OnInit } from '@angular/core';
import { AirlineComboBox } from 'src/app/entities/airline-combo-box/airline-combo-box';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';

@Component({
  selector: 'app-add-destination',
  templateUrl: './add-destination.component.html',
  styleUrls: ['./add-destination.component.css']
})
export class AddDestinationComponent implements OnInit {
  airlines = new  Array<AirlineComboBox>();

  constructor(public service: LoadDataService) { }

  ngOnInit(): void {
    this.loadInitializeData();
  }

  loadInitializeData(): void {
    this.service.loadAirlines().subscribe(
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
    this.service.addNewDestination().subscribe(
      (res: any) => {
        alert("Destination added successfully.");
        this.service.destinationForm.reset();
      },
      err => {
        console.log(err);
        if(err.error === "Add destination is unsuccessffully.Server not found selected airline."){
          alert("Add destination is unsuccessffully.Server not found selected airline.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }

}
