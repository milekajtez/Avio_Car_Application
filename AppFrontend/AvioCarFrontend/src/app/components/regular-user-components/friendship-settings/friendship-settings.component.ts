import { Component, OnInit } from '@angular/core';
import { RegularUserService } from 'src/app/services/regular-user/regular-user.service';
import { FriendshipRequest } from 'src/app/entities/regular-user-entities/friendship-request/friendship-request';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-friendship-settings',
  templateUrl: './friendship-settings.component.html',
  styleUrls: ['./friendship-settings.component.css']
})
export class FriendshipSettingsComponent implements OnInit {
  listOfMyRequests = new Array<FriendshipRequest>();
  requestList = new Array<FriendshipRequest>();
  myUsername: string;

  constructor(public service: RegularUserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.myUsername = params['UserName'];
    });

    this.loadMyRequests(this.myUsername);
    this.loadRequests(this.myUsername);
  }

  //#region 1 - Metoda za ucitavanje MOJIH zahteva
  loadMyRequests(myUsername: string): void {
    this.service.loadRequestsMethod(myUsername, "myRequests").subscribe(
      (res: any) => {
        this.listOfMyRequests = [];
        for(var i = 0; i < res.length; i++){
          this.listOfMyRequests.push(new FriendshipRequest(res[i].username, res[i].firstname, res[i].lastname));
        }
      },
      err => {
        if (err.error === "Loading requests failed. Server not found you on database."){
          alert("Loading requests failed. Server not found you on database.");
        }
        else if(err.error === "Current user haven't any request in active mode."){
          alert("Current user haven't any request in active mode.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za ucitavanje zahteva drugih korisnika meni
  loadRequests(myUsername: string): void {
    this.service.loadRequestsMethod(myUsername, "requestsForMe").subscribe(
      (res: any) => {
        this.requestList = [];
        for(var i = 0; i < res.length; i++){
          this.requestList.push(new FriendshipRequest(res[i].username, res[i].firstname, res[i].lastname));
        }
      },
      err => {
        if (err.error === "Loading requests failed. Server not found you on database."){
          alert("Loading requests failed. Server not found you on database.");
        }
        else if(err.error === "Current user haven't any request in active mode."){
          alert("Current user haven't any request in active mode.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
  //#region 3 - Metoda za slanje zahteva
  sendRequestMethod(): void {
    this.service.sendRequestMethod(this.myUsername).subscribe(
      (res: any) => {
        alert("Sending request successfuly.");
        this.listOfMyRequests = [];
        this.loadMyRequests(this.myUsername);
        this.service.sendRequestForm.reset();
      },
      err => {
        console.log(err);
        if(err.error === "Sending request failed. Server not found current user."){
          alert("Sending request failed. Server not found current user.");
        }
        else if(err.error === "Sending request failed. Server not found entered user. Please enter different username."){
          alert("Sending request failed. Server not found entered user. Please enter different username.");
        }
        else if(err.error === "Sending request failed because you already send requst to entered user."){
          alert("Sending request failed because you already send request to entered user.");
        }
        else if(err.error === "Sending request failed.Entered user and you are friends already."){
          alert("Sending request failed.Entered user and you are friends already.");
        }
        else if(err.error === "Sending request failed because entered user already send request to you."){
          alert("Sending request failed because entered user already send request to you.");
        }
        else if(err.error === "Sending request failed. Disabling sending requests to yourself."){
          alert("Sending request failed. Disabling sending requests to yourself.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion  
  //#region 4 - Metoda za odustajanje od MOG zahteva
  deleteMyRequest(request: any){
    this.service.deleteRequest(this.myUsername, request.username).subscribe(
      (res: any) => {
        alert("Deleting request succesfuly.");
        this.listOfMyRequests = [];
        this.loadMyRequests(this.myUsername);
      },
      err => {
        console.log(err);
        if(err.error === "Deleting failed. Server not found you in base."){
          alert("Deleting failed. Server not found you in base.");
        }
        else if(err.error === "Deleting failed. Server not found friend for deleting."){
          alert("Deleting failed. Server not found friend for deleting.");
        }
        else if (err.error == "Deleting failed. You not friend with selected user."){
          alert("Deleting failed. You not friend with selected user.");
        }
        else{
          alert("Unknown error.");
        }

        this.listOfMyRequests = [];
        this.loadMyRequests(this.myUsername);
      }
    );
  }
  //#endregion
  //#region 5 - Metoda za prihvatanje zahteva
  confirmRequest(request: any): void {
    this.service.confirmRequest(this.myUsername, request.username).subscribe(
      (res: any) => {
        alert("Confirm request successfuly");
        this.requestList = [];
        this.loadRequests(this.myUsername);
      },
      err => {
        console.log(err);
        if(err.error === "Confirm failed. Server not found you in base."){
          alert("Confirm failed. Server not found you in base.");
        }
        else if(err.error === "Confirm failed. Server not found friend for deleting."){
          alert("Confirm failed. Server not found friend for deleting.");
        }
        else if(err.error === "Confirm request failed. Server not found request in base."){
          alert("Confirm request failed. Server not found request in base.");
        }
        else{
          alert("Unknown error.");
        }

        this.requestList = [];
        this.loadRequests(this.myUsername);
      }
    );
  }
  //#endregion
  //#region 6 - Metoda za odbijanje zahteva
  rejectRequest(request: any) : void {
    this.service.rejectRequest(this.myUsername, request.username).subscribe(
      (res: any) => {
        alert("Reject request succesfuly.");
        this.requestList = [];
        this.loadRequests(this.myUsername);
      },
      err => {
        console.log(err);
        if(err.error === "Deleting failed. Server not found you in base."){
          alert("Reject failed. Server not found you in base.");
        }
        else if(err.error === "Deleting failed. Server not found friend for deleting."){
          alert("Reject failed. Server not found friend for reject.");
        }
        else if (err.error == "Deleting failed. You not friend with selected user."){
          alert("Reject failed. You not friend with selected user.");
        }
        else{
          alert("Unknown error.");
        }

        this.requestList = [];
        this.loadRequests(this.myUsername);
      }
    );
  }
  //#endregion
}
