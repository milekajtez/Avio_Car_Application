import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared/shared-data.service';

@Component({
  selector: 'app-regular-menu',
  templateUrl: './regular-menu.component.html',
  styleUrls: ['./regular-menu.component.css']
})
export class RegularMenuComponent implements OnInit {
  defaultComponent = 0;
  username: string;

  constructor(private route: ActivatedRoute, private data: SharedDataService) {
    this.defaultComponent = 1;
  }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message => this.username = message);
    if(this.username === "default message"){
      this.route.params.subscribe(params => {
        this.username = params['UserName'];
      });
    }
  }

  methodOption1(): void {
    this.defaultComponent = 1;
  }

  methodOption2(): void {
    this.defaultComponent = 2;
  }

  methodOption4(): void {
    this.defaultComponent = 4;
  }

  methodOption6(): void {
    this.defaultComponent = 6;
  }

  methodOption7(): void {
    this.defaultComponent = 7;
  }

  methodOption8(): void {
    this.defaultComponent = 8;
  }

  logout(): void {
    localStorage.removeItem("token");
  }
  
}
