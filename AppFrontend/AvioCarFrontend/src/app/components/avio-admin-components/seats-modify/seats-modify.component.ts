import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight/flight.service';
import { Ticket } from 'src/app/entities/avio-entities/ticket/ticket';
import { Flight } from 'src/app/entities/avio-entities/flight/flight';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';

@Component({
  selector: 'app-seats-modify',
  templateUrl: './seats-modify.component.html',
  styleUrls: ['./seats-modify.component.css']
})
export class SeatsModifyComponent implements OnInit {
  flights = new Array<Flight>();
  selectedTicket: Ticket;
  tickets = Array<Ticket>();
  
  constructor(public service: FlightService, public loadService: LoadDataService) {
    this.selectedTicket = new Ticket("","","","","","","");
    this.service.comboBoxFlightForm.reset();
   }

  ngOnInit(): void {
    this.initializeFlights();
  }

  //#region 1 - Metoda za ucitavanje letova
  initializeFlights(){
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

          this.flights.push(new Flight(res[i].flightID, res[i].startTime, res[i].endTime, res[i].startLocation,
            res[i].endLocation, res[i].flightTime, res[i].flightLength, rating, res[i].additionalInformation, 
            res[i].numberOfTransfers, res[i].allTransfers, res[i].planeName, res[i].lugageWeight));
        }
      },
      err => {
        alert("Loading flight failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za ucitavanje karata odredjenog leta
  loadTickets(){
    this.loadService.loadTickets(this.service.comboBoxFlightForm.value.Flight).subscribe(
      (res: any) => {
        this.tickets = [];
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

          this.tickets.push(new Ticket(res[i].ticketID, res[i].ticketNumber, res[i].ticketPrice, type, res[i].timeOfTicketPurchase,
            res[i].isTicketPurchased, res[i].isQuickBooking));

          this.tickets.sort(function(a: any, b: any){
            return a.ticketNumber - b.ticketNumber;
          });
        }
      },
      err => {
        if(err.error === "Currently this flight not have any ticket."){
          alert("Currently, this flight not have any ticket.");
          this.tickets = [];
          this.selectedTicket = new Ticket("","","","","","","");
        }
      }
    );
  }
  //#endregion
  //#region 3 - Metoda za selektovanje odredjene karte
  onSelect(ticket: any){
    this.selectedTicket = ticket;
    console.log(this.service.comboBoxFlightForm.value.Flight);
    console.log(this.selectedTicket);
    console.log(this.tickets);
  }
  //#endregion
  //#region 4 - Metoda za brisanje selektovane karte
  deleteTicket(){
    if(this.tickets.length != 0){
      if(this.selectedTicket.ticketID != ""){
        this.service.deleteTicket(this.service.comboBoxFlightForm.value.Flight, this.selectedTicket.ticketID).subscribe(
          (res: any) => {
            alert("Deleting ticket successfuly.");
            this.tickets = [];
            this.loadTickets();
            this.selectedTicket = new Ticket("","","","","","","");
          },
          err => {
            if(err.error === "Deleting unsuccessfuly because ticket is purchased."){
              alert("Deleting failed because ticket is purchased.");
            }
            else{
              alert("Unknown error.");
            }
          }
        );
      }
      else{
        // znaci da imam listu tiketa..ali nisam ni jednog seletovao
        alert("You need to select ticket from ticket list");
      }
    }
    else{
      // znaci lista karata je prazna..znaci nije selektovana karta..znaci ne moze se brisati
      alert("You need to select flight and then ticket from ticket list");
    }
  }
  //#endregion
  //#region 5 - Metoda za brisanje svih karata
  deleteAllTickets(){
    if(this.tickets.length != 0){
      this.service.deleteAllTickets(this.service.comboBoxFlightForm.value.Flight).subscribe(
        (res: any) => {
          alert("Deleting ticket successfuly.");
            this.tickets = [];
            this.selectedTicket = new Ticket("","","","","","","");
        },
        err => {
          console.log(err);
          alert("Deleting tickets failed.");
        }
      );
    }
    else{
      alert("Deleting all ticket failed because selected flight not have any ticket.");
    }
  }
  //#endregion
  //#region 6 - Metoda za dodavanje nove karte
  addNewTicket(){
    //da li je selektovan let
    if(this.service.comboBoxFlightForm.value.Flight != null){
      // provera da li vec postoji karta za unesenim brojem nove karte
      var numberExsist = false;
      if(this.tickets.length != 0){
        for(var i = 0; i < this.tickets.length; i++){
          if(this.tickets[i].ticketNumber == this.service.newTicketForm.value.TicketNumber){
            numberExsist = true;
            break;
          }
        }
      }

      if(!numberExsist){
        this.service.add1newTicket(this.service.comboBoxFlightForm.value.Flight).subscribe(
          (res: any) => {
            alert("Adding ticket successfuly.");
            this.service.newTicketForm.reset();
            this.tickets = [];
            this.loadTickets();
            this.selectedTicket = new Ticket("","","","","","","");
          },
          err => {
            if(err.error === "Add ticket is unsuccessffully.Server not found selected flight."){
              alert("Add ticket failed. Server not found selected flight.");
            }
            else{
              console.log(err);
              alert("Unknown error.");
            }
          }
        );
      }
      else{
        alert("Adding unsuccessfuly because flight already have ticket with same number");
      }
    }
    else{
      alert("You need to select flight.");
    }
  }
  //#endregion
  //#region 7 - Metoda za menjanje selektovane karte
  changeTicket(){
    if(this.service.comboBoxFlightForm.value.Flight != null){
      if(this.selectedTicket.ticketID != ""){
        if(this.service.changeTicketForm.value.TicketNumber == null && this.service.changeTicketForm.value.TicketType == null
          && this.service.changeTicketForm.value.TicketPrice == null && this.service.changeTicketForm.value.IsQuickBooking == null){
            alert("Change failed because you not enter any new information.");
        }
        else{
          this.service.changeTicket(this.selectedTicket.ticketID, this.service.comboBoxFlightForm.value.Flight).subscribe(
            (res: any) => {
              alert("Changing ticket successfuly.");
              this.service.changeTicketForm.reset();
              this.tickets = [];
              this.loadTickets();
              this.selectedTicket = new Ticket("","","","","","","");
            },
            err => {
              if(err.error === "Change unsuccessfuly because another ticket have entered new ticket number."){
                alert("Change ticket failed because another ticket have entered new ticket number.");
              }
              else{
                console.log(err);
                alert("Unknown error.");
              }
            }
          );
        }
      }
      else{
        alert("You need to select ticket from ticket list.");
      }
    }
    else{
      alert("You need to select flight.");
    }
  }
  //#endregion
}
