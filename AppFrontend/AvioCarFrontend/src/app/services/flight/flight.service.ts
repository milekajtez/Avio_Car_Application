import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Flight } from 'src/app/entities/avio-entities/flight/flight';
import { AbstractFilterParam } from 'src/app/entities/abstract-filter-param/abstract-filter-param';
import { StringFilterParam } from 'src/app/entities/string-filter-param/string-filter-param';
import { NumberFilterParam } from 'src/app/entities/number-filter-param/number-filter-param';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  readonly BaseURI = 'http://localhost:57382/api';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  newFlightForm = this.fb.group({
    StartTime: ['', Validators.required],
    EndTime: ['', Validators.required],
    StartLocation: ['', [Validators.required, Validators.pattern("[a-z A-Z]+")]],
    EndLocation: ['', [Validators.required, Validators.pattern("[a-z A-Z]+")]],
    FlightLength: ['', [Validators.required, Validators.pattern("[0-9]{1,6}")]],
    AdditionalInformation: ['',Validators.required],
    NumberOfTransfers: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    AllTransfers: ['', Validators.required],
    PlaneName: ['', Validators.required],
    LugageWeight: ['', [Validators.required,Validators.pattern("[0-9]+")]],
    Airline: ['', Validators.required]
  });

  aircraftSeatForm = this.fb.group({
    Flight: ['', Validators.required],
    NumberOfEconomicSeats: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    EconomicClassPrice: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    NumberOfFirstSeats: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    FirstClassPrice: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    NumberOfBusinessSeats: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    BusinessClassPrice: ['', [Validators.required, Validators.pattern("[0-9]+")]]
  });

  comboBoxFlightForm = this.fb.group({
    Flight: ['', Validators.required]
  });

  newTicketForm = this.fb.group({
    TicketNumber: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    TicketType: ['', Validators.required],
    TicketPrice: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    IsQuickBooking: ['',Validators.required]
  });
  
  changeTicketForm = this.fb.group({
    TicketNumber: ['', Validators.pattern("[0-9]+")],
    TicketType: [''],
    TicketPrice: ['', Validators.pattern("[0-9]+")],
    IsQuickBooking: ['']
  });

  addNewFlight() {
    var body = {
      StartTime: this.newFlightForm.value.StartTime,
      EndTime: this.newFlightForm.value.EndTime,
      StartLocation: this.newFlightForm.value.StartLocation,
      EndLocation: this.newFlightForm.value.EndLocation,
      FlightLength: this.newFlightForm.value.FlightLength,
      AdditionalInformation: this.newFlightForm.value.AdditionalInformation,
      NumberOfTransfers: this.newFlightForm.value.NumberOfTransfers,
      AllTransfers: this.newFlightForm.value.AllTransfers,
      PlaneName: this.newFlightForm.value.PlaneName,
      LugageWeight: this.newFlightForm.value.LugageWeight,
      AirlineID: this.newFlightForm.value.Airline
    }

    return this.http.post(this.BaseURI + '/LoadData/AddFlight', body);
  }

  addNewSeatsConfiguration() {
    var body = {
      Flight: this.aircraftSeatForm.value.Flight,
      NumberOfEconomicSeats: this.aircraftSeatForm.value.NumberOfEconomicSeats,
      EconomicClassPrice: this.aircraftSeatForm.value.EconomicClassPrice,
      NumberOfFirstSeats: this.aircraftSeatForm.value.NumberOfFirstSeats,
      FirstClassPrice: this.aircraftSeatForm.value.FirstClassPrice,
      NumberOfBusinessSeats: this.aircraftSeatForm.value.NumberOfBusinessSeats,
      BusinessClassPrice: this.aircraftSeatForm.value.BusinessClassPrice
    }

    return this.http.post(this.BaseURI + '/LoadData/AddSeatsConfiguration', body);
  }

  // brisanje selektovane karte
  deleteTicket(flightID: string, ticketID: string){
    return this.http.delete(this.BaseURI + '/LoadData/DeleteTicket/' + flightID + "/" + ticketID);
  }

  // brisanje svih karata leta
  deleteAllTickets(flightID: string){
    return this.http.delete(this.BaseURI + '/LoadData/DeleteAllTickets/' + flightID);
  }

  // metoda za dodavanje nove karte
  add1newTicket(flightID: string){
    var body = {
      TicketNumber: this.newTicketForm.value.TicketNumber,
      TicketType: this.newTicketForm.value.TicketType,
      TicketPrice: this.newTicketForm.value.TicketPrice,
      IsQuickBooking: ""
    }

    if(this.newTicketForm.value.IsQuickBooking){
      body.IsQuickBooking = "true";
    }
    else{
      body.IsQuickBooking = "false";
    }
    
    return this.http.post(this.BaseURI + '/LoadData/AddNewTicket/' + flightID, body);
  }

  // metoda za zimenu karte
  changeTicket(ticketID: string, flightID: string){
    var body = {
      TicketNumber: this.changeTicketForm.value.TicketNumber,
      TicketType: this.changeTicketForm.value.TicketType,
      TicketPrice: this.changeTicketForm.value.TicketPrice,
      IsQuickBooking: ""
    }

    if(this.changeTicketForm.value.IsQuickBooking){
      body.IsQuickBooking = "true";
    }
    else if(!this.changeTicketForm.value.IsQuickBooking){
      body.IsQuickBooking = "false";
    }
    else{
      body.IsQuickBooking = "";
    }

    return this.http.put(this.BaseURI + '/LoadData/ChangeTicket/' + ticketID + "/" + flightID, body);
  }


  //startlocation
  checkStartLocationFilter(flight: Flight, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof StringFilterParam && filterParam.getFilterParamName() === 'startLocationFilter' && !flight.startLocation.toLowerCase().includes(filterParam.getFilterParamValue().toLowerCase());
  }
  //endLocation
  checkEndLocationFilter(flight: Flight, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof StringFilterParam && filterParam.getFilterParamName() === 'endLocationFilter' && !flight.endLocation.toLowerCase().includes(filterParam.getFilterParamValue().toLowerCase());
  }
  //avgRating
  checkFlightRatingFilter(flight: Flight, filterParam: AbstractFilterParam): boolean {
    return filterParam instanceof NumberFilterParam && filterParam.getFilterParamName() === 'flightRatingFilter' && !(Number(flight.flightRating) == filterParam.getFilterParamValue());
  }

  // metoda za filtriranje letova
  filterFlights(flights: Flight[], filterParams: AbstractFilterParam[]): Flight[] {
    let filteredFlights = new Array<Flight>();
    for (const flight of flights) {
      let addFlight = true;
      for (const filterParam of filterParams) {
        if (this.checkStartLocationFilter(flight, filterParam) || this.checkEndLocationFilter(flight, filterParam)
        || this.checkFlightRatingFilter(flight, filterParam)){
          addFlight = false;
        }
      }

      if (addFlight){
        filteredFlights.push(flight);
      }
    }

    return filteredFlights;
  }
}
