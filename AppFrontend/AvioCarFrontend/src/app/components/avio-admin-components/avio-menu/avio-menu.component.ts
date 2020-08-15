import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared/shared-data.service';

@Component({
  selector: 'app-avio-menu',
  templateUrl: './avio-menu.component.html',
  styleUrls: ['./avio-menu.component.css']
})
export class AvioMenuComponent implements OnInit {
  defaultComponent = 0;
  username: string;

  constructor(private route: ActivatedRoute, private data: SharedDataService) 
  {
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
