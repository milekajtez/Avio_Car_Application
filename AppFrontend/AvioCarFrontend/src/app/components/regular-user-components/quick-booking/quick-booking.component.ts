import { Component, OnInit } from '@angular/core';
import { QuickFlightReservation } from 'src/app/entities/regular-user-entities/quick-flight-reservation/quick-flight-reservation';
import { RegularUserService } from 'src/app/services/regular-user/regular-user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quick-booking',
  templateUrl: './quick-booking.component.html',
  styleUrls: ['./quick-booking.component.css']
})
export class QuickBookingComponent implements OnInit {
  username: string;
  quickReservations = new Array<QuickFlightReservation>();

  constructor(public service: RegularUserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['UserName'];
    });

    this.loadQuickReservations();
  }

  //#region 1 - Metoda za ucitavanje isQuckBooking letova
  loadQuickReservations(){
    this.service.loadQuickReservations(this.username).subscribe(
      (res: any) => {
        this.quickReservations = [];
        for(let i = 0; i < res.length; i++){
          this.quickReservations.push(new QuickFlightReservation(res[i].ticketID, res[i].startTime, res[i].endTime,
            res[i].startLocation, res[i].endLocation, res[i].ticketNumber, res[i].ticketType, res[i].ticketPrice,
            res[i].ticketDisountedPrice));
        }
      },
      err => {
        console.log(err);
        if(err.error === "Loading quick reservation failed. Server not user in data base."){
          alert("Loading quick reservation failed. Server not user in data base.");
        }
        else if(err.error == "Loading quick reservation failed. Server not found any ticket in data base."){
          alert("Loading quick reservation failed. Server not found any ticket in data base.");
        }
        else if(err.error == "Loading quick reservation flights failed. Server not found any reservation of this type."){
          alert("Loading quick reservation flights failed. Server not found any reservation of this type.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za rezervisanje isQuickBooking leta
  bookingQucikFlight(reservation: any){
    this.service.bookFlight(this.username, reservation.ticketID).subscribe(
      (res: any) => {
        alert("Booking flight successfuly.");
      },
      err => {
        if(err.error === "Booking flight failed. Server not found user in database."){
          alert("Booking flight failed. Server not found user in database.");
        }
        else if(err.error === "Booking flight failed. User already have this ticket in his reservated tickets."){
          alert("Booking flight failed. User already have this ticket in his reservated tickets.");
        }
        else{
          alert("Unknown error");
        }
      }
    );
  }
  //#endregion
}
