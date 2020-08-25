import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared/shared-data.service';

@Component({
  selector: 'app-regular-menu',
  templateUrl: './regular-menu.component.html',
  styleUrls: ['./regular-menu.component.css']
})
export class RegularMenuComponent implements OnInit {

  constructor(public service: SharedDataService, public router: Router) { }

  ngOnInit(): void {
    /*if(!this.service.checkIsTokenValid()){
      this.logout();
    }*/
  }

  /*logout(): void {
    localStorage.removeItem("token");
  }*/

}
