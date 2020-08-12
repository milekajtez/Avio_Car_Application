import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';

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

  constructor(public service: LoadDataService, private toastr: ToastrService) {
   }

  ngOnInit(): void {
    this.initializeData();
  }

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
        alert("Loading current discounts is unsuccessfully.");
      }
    );
  }

  onSubmit1() : void {

  }

  onSubmit2() : void {

  }

  onSubmit3() : void {

  }

  onSubmit4() : void {

  }

}
