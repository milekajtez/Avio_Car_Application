import { Component, OnInit } from '@angular/core';
import { RegularUserService } from 'src/app/services/regular-user/regular-user.service';
import { Flight } from 'src/app/entities/avio-entities/flight/flight';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { AbstractFilterParam } from 'src/app/entities/abstract-filter-param/abstract-filter-param';
import { NumberFilterParam } from 'src/app/entities/number-filter-param/number-filter-param';

@Component({
  selector: 'app-flight-reservation',
  templateUrl: './flight-reservation.component.html',
  styleUrls: ['./flight-reservation.component.css']
})
export class FlightReservationComponent implements OnInit {
  allFlights = new Array<Flight>();
  searchedFlights = new Array<Flight>();
  filteredFlights = new Array<Flight>();

  constructor(public service: RegularUserService, public loadService: LoadDataService) { }

  ngOnInit(): void {
    this.loadFlights();
  }

  //#region 1 - Metoda za ucitavanje svih letova
  loadFlights(): void {
    this.loadService.loadFlights().subscribe(
      (res: any) => {
        console.log(res);
        var rating;
        for(var i = 0; i < res.length; i++){
          if(res[i].numberOfFlightGrades === "0"){
            rating = 0;
          }
          else{
            rating = Number(res[i].flightPrice) / Number(res[i].numberOfFlightGrades);
          }

          this.allFlights.push( new Flight(res[i].flightID, res[i].startTime, res[i].endTime, res[i].startLocation,
            res[i].endLocation, res[i].flightTime, res[i].flightLength, rating, res[i].additionalInformation, 
            res[i].numberOfTransfers, res[i].allTransfers, res[i].planeName, res[i].lugageWeight));
        }
      },
      err => {
        console.log(err);
        alert("Loading flight failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za pretragu letova prema odredjenim parametrima i metoda resetovanje forme
  searchFlights(){
    this.searchedFlights = this.allFlights;
    if((this.service.searchFlightForm.value.StartLocation === "" && this.service.searchFlightForm.value.EndLocation === "" &&
        this.service.searchFlightForm.value.StartTime === "") || this.service.searchFlightForm.value.StartLocation == null && 
        this.service.searchFlightForm.value.EndLocation == null && this.service.searchFlightForm.value.StartTime == null){
      alert("Searching failed. You not entered any info in form for searching flights.");
    }
    else{
      if(this.service.searchFlightForm.value.StartLocation != null){
        if(this.service.searchFlightForm.value.StartLocation !== ""){
          this.searchedFlights = this.searchedFlights.filter(item => item.startLocation === this.service.searchFlightForm.value.StartLocation);
        }
      }
      if(this.service.searchFlightForm.value.EndLocation != null){
        if(this.service.searchFlightForm.value.EndLocation !== ""){
          this.searchedFlights = this.searchedFlights.filter(item => item.endLocation === this.service.searchFlightForm.value.EndLocation);
        }
      }
      if(this.service.searchFlightForm.value.StartTime != null){
        if(this.service.searchFlightForm.value.StartTime !== ""){
          this.searchedFlights = this.searchedFlights.filter(item => item.startTime === (this.service.searchFlightForm.value.StartTime + ":00"));
        }
      }

      if(this.searchedFlights.length == 0){
        alert("No flight with the specified parameters was found.");
      }

      this.filteredFlights = this.searchedFlights;
    }
  }
  
  resetSearch(){
    this.service.searchFlightForm.reset();
    this.filteredFlights = [];
    this.searchedFlights = [];
  }
  //#endregion
  //#region 3 - MEtode za filtriranje letova
  filterFlight(){
    let filterParams = new Array<AbstractFilterParam>();
    if (this.getFilterFieldValue("laguageWeightFilter")) {
      filterParams.push(this.addLaguageWeightFilterParam());
    }
    if (this.getFilterFieldValue("flightTimeFilter")) {
      filterParams.push(this.addFlightTimeFilterParam());
    }
    if (this.getFilterFieldValue("flightLengthFilter")) {
      filterParams.push(this.addFlightLengthgFilterParam());
    }

    this.filteredFlights = this.service.filterFlights(this.searchedFlights, filterParams);
  }

  resetFilter(){
    this.filteredFlights = this.searchedFlights;
  }

  getFilterFieldValue(filterFieldId: string){
    return (<HTMLInputElement> document.getElementById(filterFieldId)).value;
  }

  addLaguageWeightFilterParam(): ReturnType<any> {
    return new NumberFilterParam("laguageWeightFilter", +this.getFilterFieldValue("laguageWeightFilter"));
  }

  addFlightTimeFilterParam(): ReturnType<any> {
    return new NumberFilterParam("flightTimeFilter", +this.getFilterFieldValue("flightTimeFilter"));
  }

  addFlightLengthgFilterParam(): ReturnType<any> {
    return new NumberFilterParam("flightLengthFilter", +this.getFilterFieldValue("flightLengthFilter"));
  }
  //#endregion

  
  flightReservation(flight: any){}

}
