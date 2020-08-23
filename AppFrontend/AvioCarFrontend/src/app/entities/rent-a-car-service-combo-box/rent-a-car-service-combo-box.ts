export class RentACarServiceComboBox {
    carServiceID: string;
    carServiceName: string;
    carServiceAddress: string;
    carServicePromotionDescription: string;
    carServiceRating: number;
    servicePriceList: string;
    serviceEarnings: number;

    constructor(carServiceID: string, carServiceName: string, carServiceAddress: string, carServicePromotionDescription: string,
        carServiceRating: number, servicePriceList: string, serviceEarnings: number)
    {
        this.carServiceID = carServiceID;
        this.carServiceName = carServiceName;
        this.carServiceAddress = carServiceAddress;
        this.carServicePromotionDescription = carServicePromotionDescription;
        this.carServiceRating = carServiceRating;
        this.servicePriceList = servicePriceList;
        this.serviceEarnings = serviceEarnings;
    }
}
