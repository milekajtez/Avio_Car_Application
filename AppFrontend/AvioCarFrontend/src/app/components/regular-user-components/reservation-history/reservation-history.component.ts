import { Component, OnInit } from '@angular/core';
import { FlightReservation } from 'src/app/entities/regular-user-entities/flight-reservation/flight-reservation';
import { ActivatedRoute } from '@angular/router';
import { RegularUserService } from 'src/app/services/regular-user/regular-user.service';

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.css']
})
export class ReservationHistoryComponent implements OnInit {
  username: string;
  activeFlightReservation = Array<FlightReservation>();
  historyflightReservation = Array<FlightReservation>();

  constructor(private route: ActivatedRoute, private service: RegularUserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['UserName'];
    });

    this.loadActiveReservations();
    this.loadHistoryReservation();
  }

  //#region 1 - Metoda za ucitavanje aktovnih rezervacija
  loadActiveReservations(): void {
    this.service.loadReservations(this.username, "active").subscribe(
      (res: any) => {
        this.activeFlightReservation = [];

        for(let i = 0; i< res.length; i++){
          this.activeFlightReservation.push(new FlightReservation(res[i].ticketID, res[i].startTime, res[i].endTime,
            res[i].startLocation, res[i].endLocation, res[i].ticketNumber, res[i].ticketType));
        }
      },
      err => {
        if(err.error === "Loading failed. Server not found user in data base."){
          alert("Loading failed. Server not found user in data base.");
        }
        else if(err.error == "Loading failed. User not have any active flight reservation."){
          alert("Loading failed. User not have any active flight reservation.");
        }
        else{
          alert("Unknow error.");
        }
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za ucitavanje rezervacija koje su prosle
  loadHistoryReservation(): void {
    this.service.loadReservations(this.username, "history").subscribe(
      (res: any) => {
        this.historyflightReservation = [];

        for(let i = 0; i< res.length; i++){
          this.historyflightReservation.push(new FlightReservation(res[i].ticketID, res[i].startTime, res[i].endTime,
            res[i].startLocation, res[i].endLocation, res[i].ticketNumber, res[i].ticketType));
        }
      },
      err => {
        if(err.error === "Loading failed. Server not found user in data base."){
          alert("Loading failed. Server not found user in data base.");
        }
        else if(err.error == "Loading failed. User not have any active flight reservation."){
          alert("Loading failed. User not have any history flight reservation.");
        }
        else{
          alert("Unknow error.");
        }
      }
    );
  }
  //#endregion
  //#region 3 - Metoda za otkazivanje aktivne rezervacije
  deleteReservation(reservation: any){
    this.service.deleteReservation(this.username, reservation.ticketID).subscribe(
      (res: any) => {
        alert("Deleting reservation successfuly.");
        this.activeFlightReservation = [];
        this.loadActiveReservations();
      },
      err => {
        if(err.error === "Deleting failed. Server not found current user in data base."){
          alert("Deleting failed. Server not found current user in data base.");
        }
        else if(err.error == "Deleting failed. User not have this reserved ticket."){
          alert("Deleting failed. User not have this reserved ticket.");
        }
        else if(err.error == "Deleting failed. Server not found this ticket in data base."){
          alert("Deleting failed. Server not found this ticket in data base.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion

  //#region 4 - Metoda za ocenjivanje leta
  ratingFlight(reservation: any){

  }
  //#endregion
}
