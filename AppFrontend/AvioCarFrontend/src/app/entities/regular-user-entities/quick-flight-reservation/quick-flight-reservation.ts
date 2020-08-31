export class QuickFlightReservation {
    ticketID: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    ticketNumber: string;
    ticketType: string;
    ticketPrice: string;
    ticketDisountedPrice: string;

    constructor(ticketID: string, startTime: string, endTime: string, startLocation: string, endLocation: string, 
        ticketNumber: string, ticketType: string, ticketPrice: string, ticketDisountedPrice: string){
            this.ticketID = ticketID;
            this.startTime = startTime;
            this.endTime = endTime;
            this.startLocation = startLocation;
            this.endLocation = endLocation;
            this.ticketNumber = ticketNumber;
            this.ticketType = ticketType;
            this.ticketPrice = ticketPrice;
            this.ticketDisountedPrice = ticketDisountedPrice;
        }
}
