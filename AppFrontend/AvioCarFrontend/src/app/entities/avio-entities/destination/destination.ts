export class Destination {
    destinationID : string;
    airportName: string;
    city: string;
    country: string;

    constructor(destinationID : string, airportName: string, city: string, country: string){
        this.destinationID = destinationID;
        this.airportName = airportName;
        this.city = city;
        this.country = country;
    }
}
