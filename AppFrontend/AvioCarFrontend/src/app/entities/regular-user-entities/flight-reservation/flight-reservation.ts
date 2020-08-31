export class FlightReservation {
    ticketID: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    ticketNumber: string;
    ticketType: string;

    constructor(ticketID: string, startTime: string, endTime: string, startLocation: string, endLocation: string, 
        ticketNumber: string, ticketType: string){
            this.ticketID = ticketID;
            this.startTime = startTime;
            this.endTime = endTime;
            this.startLocation = startLocation;
            this.endLocation = endLocation;
            this.ticketNumber = ticketNumber;
            this.ticketType = ticketType;
        }
}
