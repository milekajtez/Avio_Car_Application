import { Component, OnInit } from '@angular/core';
import { RentACarService } from 'src/app/services/rent-a-car/rent-a-car.service';
import { RentACarServiceComboBox } from 'src/app/entities/rent-a-car-service-combo-box/rent-a-car-service-combo-box';
import { BranchOffice } from 'src/app/entities/car-entities/branch-office/branch-office';

@Component({
  selector: 'app-add-branch-office',
  templateUrl: './add-branch-office.component.html',
  styleUrls: ['./add-branch-office.component.css']
})
export class AddBranchOfficeComponent implements OnInit {
  rentACarServices = new Array<RentACarServiceComboBox>();
  branchOffices = new Array<BranchOffice>();

  constructor(public service: RentACarService) { }

  ngOnInit(): void {
    this.initializeRentACarServiceData();
    this.initializeLoadBranchOfficesData();
  }

  initializeRentACarServiceData(): void {
    this.service.loadRentACarServices().subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++){
          var rating;
          if(res[i].numberOfCarServiceGrades == "0"){
            rating = 0;
          }
          else{
            rating = Number(res[i].carServicePrice) / Number(res[i].numberOfCarServiceGrades);
          }

          this.rentACarServices.push(new RentACarServiceComboBox(res[i].carServiceID, res[i].carServiceName, 
            res[i].carServiceAddress, res[i].carServicePromotionDescription, rating, res[i].servicePriceList, 
            res[i].serviceEarnings));
        }
      },
      err => {
        console.log(err);
        alert("Loading rent-a-car services is unsuccessfully.");
      }
    );
  }

  initializeLoadBranchOfficesData() : void {
    this.service.loadBranchOffices().subscribe(
      (res: any) => {
        for(var i = 0; i < res.length; i++){
          this.branchOffices.push(new BranchOffice(res[i].branchOfficeID, res[i].branchOfficeAddress, res[i].city, 
            res[i].country));
        }
      },
      err => {
        console.log(err);
        alert("Loading branch offices is unsuccessfully.");
      }
    );
  }

  addSubmit(): void {
    this.service.addNewBranch().subscribe(
      (res: any) => {
        alert("Branch Office is added successfuly.");
        this.service.addBranchForm.reset();
      },
      err => {
        if(err.error === "Add bransh office is unsuccessffully.Server not found selected rent-a-car service."){
          alert("Add branch office is unsuccessffully.Server not found selected rent-a-car service.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }

  deleteSubmit(): void {
    this.service.deleteBranch(this.service.deleteBranchForm.value.BranchOffice).subscribe(
      (res: any) => {
        alert("Deleting branch office successfully.");
        this.branchOffices = [];
        this.initializeLoadBranchOfficesData();
      },
      err => {
        alert("Deleting branch office is unsuccessfully.");
      }
    );
  }

  changeSubmit(): void {
    this.service.changeBranchOffice().subscribe(
      (res: any) => {
        alert("Successfull change branch office.");
        this.branchOffices = [];
        this.initializeLoadBranchOfficesData();
        this.service.changeBranchForm.reset();
      },
      err => {
        if(err.error){
          alert("Change unsccessfully.All field are empty.");
        }
        else{
          alert("Unknown error.");
        }
        
      }
    );
  }

}
