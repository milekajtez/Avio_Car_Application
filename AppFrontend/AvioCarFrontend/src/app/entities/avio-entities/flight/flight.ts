export class Flight {
    flightID: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string
    flightTime: string;
    flightLength: string;
    flightRating: string;
    adittionalInformation: string;
    numberOfTransfers: string;
    allTransfers: string;
    planeName:string;
    laguageWeight: string;

    constructor(flightID: string, startTime: string, endTime: string, startLocation: string, endLocation: string,
        flightTime: string, flightLength: string, flightRating: string,  adittionalInformation: string, 
        numberOfTransfers: string, allTransfers: string, planeName:string, laguageWeight: string)
    {
        this.flightID = flightID;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.flightTime = flightTime;
        this.flightLength = flightLength;
        this.flightRating = flightRating;
        this.adittionalInformation = adittionalInformation;
        this.numberOfTransfers = numberOfTransfers;
        this.allTransfers = allTransfers;
        this.planeName = planeName;
        this.laguageWeight = laguageWeight;
    }
}
