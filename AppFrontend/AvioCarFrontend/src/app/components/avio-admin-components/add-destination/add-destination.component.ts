import { Component, OnInit } from '@angular/core';
import { AirlineComboBox } from 'src/app/entities/airline-combo-box/airline-combo-box';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { Destination } from 'src/app/entities/avio-entities/destination/destination';

@Component({
  selector: 'app-add-destination',
  templateUrl: './add-destination.component.html',
  styleUrls: ['./add-destination.component.css']
})
export class AddDestinationComponent implements OnInit {
  airlines = new  Array<AirlineComboBox>();
  destinations = new Array<Destination>()

  constructor(public service: LoadDataService) { }

  ngOnInit(): void {
    this.loadInitializeData();
    this.loadDestinationData();
  }

  //#region 1 - Metoda za uctavanje letova
  loadInitializeData(): void {
    this.service.loadAirlines().subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++){
          this.airlines.push(new AirlineComboBox(res[i].airlineID, res[i].airlineName, res[i].airlineAddress));
        }
      },
      err => {
        alert("Airlines loading failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za ucitavanje destinacija
  loadDestinationData(){
    this.service.loadAllDestinations().subscribe(
      (res: any) => {
        console.log(res);
        for(var i = 0; i < res.length; i++){
          this.destinations.push(new Destination(res[i].airportID, res[i].airportName, res[i].city, res[i].country));
        }
      },
      err => {
        alert("Destinations loading failed");
      }
    );
  }
  //#endregion
  //#region 3 - Metoda za dodavanje nove destinacije
  onSubmit(): void {
    this.service.addNewDestination().subscribe(
      (res: any) => {
        this.destinations = [];
        this.loadDestinationData();
        alert("Adding destination successfully.");
        this.service.destinationForm.reset();
      },
      err => {
        console.log(err);
        if(err.error === "Add destination is unsuccessffully.Server not found selected airline."){
          alert("Adding destination is unsuccessfully. Server not found selected airline.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
  //#region 4 - Metoda za brisanje destinacije
  deleteSubmit(){
    this.service.deleteDestination(this.service.deleteDestinationForm.value.Destination).subscribe(
      (res: any) => {
        alert("Deleting destination successfully.");
        this.destinations = [];
        this.loadDestinationData();
      },
      err => {
        alert("Deleting destination failed.");
      }
    );
  }
  //#endregion
  //#region 5 - Metoda za izmenu destinacije
  changeSubmit(){
    this.service.changeDestination().subscribe(
      (res: any) => {
        alert("Changing destination successfully.");
        this.destinations = [];
        this.loadDestinationData();
        this.service.changeDestinationForm.reset();
      },
      err => {
        if(err.error){
          alert("Changing destination failed. All field are empty.");
        }
        else{
          alert("Unknown error.");
        } 
      }
    );
  }
  //#endregion
}
