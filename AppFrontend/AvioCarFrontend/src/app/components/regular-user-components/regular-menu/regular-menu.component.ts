import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-regular-menu',
  templateUrl: './regular-menu.component.html',
  styleUrls: ['./regular-menu.component.css']
})
export class RegularMenuComponent implements OnInit {
  defaultComponent = 0;
  username: string;

  constructor(private route: ActivatedRoute) {
    this.defaultComponent = 1;
    route.params.subscribe(params => {
      this.username = params['UserName'];
    });
  }

  ngOnInit(): void {
  }

  methodOption1(): void {
    this.defaultComponent = 1;
  }

  methodOption2(): void {
    this.defaultComponent = 2;
  }

  methodOption3(): void {
    this.defaultComponent = 3;
  }

  methodOption4(): void {
    this.defaultComponent = 4;
  }

  methodOption5(): void {
    this.defaultComponent = 5;
  }

  methodOption6(): void {
    this.defaultComponent = 6;
  }

  methodOption7(): void {
    this.defaultComponent = 7;
  }

  logout(): void {
    localStorage.removeItem("token");
  }
  
}
