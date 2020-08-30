import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegularUserService } from 'src/app/services/regular-user/regular-user.service';

@Component({
  selector: 'app-reservation-flight-no',
  templateUrl: './reservation-flight-no.component.html',
  styleUrls: ['./reservation-flight-no.component.css']
})
export class ReservationFlightNoComponent implements OnInit {
  ticketID: string;

  constructor(private route: ActivatedRoute, private service: RegularUserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticketID = params['TicketID'];
    });

    this.changeTicket();
  }

  changeTicket(): void {
    this.service.changeTicket(this.ticketID, "no").subscribe(
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
