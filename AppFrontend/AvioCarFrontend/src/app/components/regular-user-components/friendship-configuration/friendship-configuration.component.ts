import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friendship-configuration',
  templateUrl: './friendship-configuration.component.html',
  styleUrls: ['./friendship-configuration.component.css']
})
export class FriendshipConfigurationComponent implements OnInit {
  profileDefaultPage: number;
  
  constructor() {
    this.profileDefaultPage = 1;
  }

  ngOnInit(): void {
  }

  profileOption1(): void {
    this.profileDefaultPage = 1;
  }

  profileOption2(): void {
    this.profileDefaultPage = 2;
  }

}
