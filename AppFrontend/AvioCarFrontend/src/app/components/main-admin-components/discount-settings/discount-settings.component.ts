import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-discount-settings',
  templateUrl: './discount-settings.component.html',
  styleUrls: ['./discount-settings.component.css']
})
export class DiscountSettingsComponent implements OnInit {
  avioPlusCar: number;
  disc300: number;
  dics600: number;
  disc1200: number;

  constructor(public service: LoadDataService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeData();
  }

  //#region 1 - Metoda za ucitavanje popusta
  initializeData(){
    this.service.loadDiscounts().subscribe(
      (res: any) => {
        this.avioPlusCar = res.avioPlusCarReservationDiscounts;
        this.disc300 = res.dicount300;
        this.dics600 = res.dicount600;
        this.disc1200 = res.dicount1200;
      },
      err => {
        console.log(err);
        alert("Loading current discounts failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za izmenu popusta
  onSubmit(discountType) : void {
    var newValue;
    if(discountType === "plus"){
      newValue = this.service.form1.value.AirlinePlusCar;
    }
    else if(discountType === "p300"){
      newValue = this.service.form2.value.Points300;
    }
    else if(discountType === "p600"){
      newValue = this.service.form3.value.Points600;
    }
    else{
      newValue = this.service.form4.value.Points1200;
    }

    var body = {
      Value: newValue,
      Type: discountType
    }

    this.service.changeDiscount(body).subscribe(
      (res) => {
        alert("Changing discount successfully.");
        this.initializeData();

      },
      err => {
        console.log(err);

        if(err.error === "Value of 'Percent 300 points' must be smaller than 'Percent 600 points'"){
          alert("Value of 'Percent 300 points' must be smaller than 'Percent 600 points'");
        }
        else if(err.error === "Value of 'Percent 600 points' must be beetwen 'Percent 300 points' and 'Percent 1200 points'"){
          alert("Value of 'Percent 600 points' must be beetwen 'Percent 300 points' and 'Percent 1200 points'");
        }
        else if(err.error === "Value of 'Percent 1200 points' must be bigger 'Percent 600 points'"){
          alert("Value of 'Percent 1200 points' must be bigger 'Percent 600 points'");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
}
