export class Car {
    carID: string;
    carName: string;
    carBrand: string;
    carModel: string;
    yearOdManufacture: string;
    numberOfSeats: string;
    carType: string;
    carRating: string;
    lugageWeight: string;
    timeOfCarPurchase: string;
    isCarPurchased: string;
    isQuickBooking: string;
    carPrice: string;

    constructor(carID: string,  carName: string,  carBrand: string, carModel: string, yearOdManufacture: string,
        numberOfSeats: string, carType: string, carRating: string, lugageWeight: string, timeOfCarPurchase: string,
        isCarPurchased: string, isQuickBooking: string, carPrice: string)
    {
        this.carID = carID;
        this.carName = carName;
        this.carBrand = carBrand;
        this.carModel = carModel;
        this.yearOdManufacture = yearOdManufacture;
        this.numberOfSeats = numberOfSeats;
        this.carType = carType;
        this.carRating = carRating;
        this.lugageWeight = lugageWeight;
        this.timeOfCarPurchase = timeOfCarPurchase;
        this.isCarPurchased = isCarPurchased;
        this.isQuickBooking = isQuickBooking;
        this.carPrice = carPrice;
    }
}
