export class Airline {
    airlineID: string;
    airlineName: string;
    airlineAddress: string;
    airlinePromotionDescription: string;
    airlinePriceList: string;
    numberOfSoldTickets: number;
    airlineRating: number;

    constructor(airlineID: string, airlineName: string, airlineAddress: string, airlinePromotionDescription: string, 
        airlinePriceList: string, numberOfSoldTickets: number, airlineRating: number)
    {
        this.airlineID = airlineID;
        this.airlineName = airlineName;
        this.airlineAddress = airlineAddress;
        this.airlinePromotionDescription = airlinePromotionDescription;
        this.airlinePriceList = airlinePriceList;
        this.numberOfSoldTickets = numberOfSoldTickets;
        this.airlineRating = airlineRating
    }
}
