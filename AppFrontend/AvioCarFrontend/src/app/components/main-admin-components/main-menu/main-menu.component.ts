import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  defaultComponent = 0;
  username: string;
  constructor(private route: ActivatedRoute) 
  {
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

  logout(): void {
    localStorage.removeItem("token");
  }

}
