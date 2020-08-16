export class FlightComboBox {
    flightID: string;
    planeName: string;
    startLocation: string;
    endLocation: string;

    constructor(flightID: string, planeName: string, startLocation: string, endLocation: string){
        this.flightID = flightID;
        this.planeName = planeName;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
    }
}
