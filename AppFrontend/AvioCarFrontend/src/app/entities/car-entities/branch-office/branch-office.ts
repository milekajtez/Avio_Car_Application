export class BranchOffice {
    branchOfficeID: string;
    branchOfficeAddress: string;
    city: string;
    country: string;

    constructor(branchOfficeID: string, branchOfficeAddress: string, city: string, country: string){
        this.branchOfficeID = branchOfficeID;
        this.branchOfficeAddress = branchOfficeAddress;
        this.city = city;
        this.country = country;
    }
}
