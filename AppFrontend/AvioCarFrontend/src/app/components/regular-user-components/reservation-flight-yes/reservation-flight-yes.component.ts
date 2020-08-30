import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegularUserService } from 'src/app/services/regular-user/regular-user.service';

@Component({
  selector: 'app-reservation-flight-yes',
  templateUrl: './reservation-flight-yes.component.html',
  styleUrls: ['./reservation-flight-yes.component.css']
})
export class ReservationFlightYesComponent implements OnInit {
  ticketID: string;

  constructor(private route: ActivatedRoute, private service: RegularUserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticketID = params['TicketID'];
    });

    this.changeTicket();
  }

  changeTicket(): void {
    this.service.changeTicket(this.ticketID, "yes").subscribe(
      (res: any) => {
        // ne vracam nista
      },
      err => {
        console.log(err);
        alert("Changing failed.");
      }
    );
  }
}
