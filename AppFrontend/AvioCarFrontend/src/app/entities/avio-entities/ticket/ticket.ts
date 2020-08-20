export class Ticket {
    ticketID: string;
    ticketNumber: string;
    ticketPrice: string;
    cardType: string;
    timeOfTicketPurchase: string;
    isTicketPurchased: string;
    isQuickBooking: string;

    constructor(ticketID: string, ticketNumber: string, ticketPrice: string, cardType: string, timeOfTicketPurchase: string,
        isTicketPurchased: string, isQuickBooking: string)
    {
        this.ticketID = ticketID;
        this.ticketNumber = ticketNumber;
        this.ticketPrice = ticketPrice;
        this.cardType = cardType;
        this.timeOfTicketPurchase = timeOfTicketPurchase;
        this.isTicketPurchased = isTicketPurchased;
        this.isQuickBooking = isQuickBooking;
    }
}
