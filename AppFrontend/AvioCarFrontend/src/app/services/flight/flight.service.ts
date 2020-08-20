import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
}
