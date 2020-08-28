import { Component, OnInit } from '@angular/core';
import { RegularUserService } from 'src/app/services/regular-user/regular-user.service';
import { ActivatedRoute } from '@angular/router';
import { Friend } from 'src/app/entities/regular-user-entities/friend/friend';
import { AbstractFilterParam } from 'src/app/entities/abstract-filter-param/abstract-filter-param';
import { StringFilterParam } from 'src/app/entities/string-filter-param/string-filter-param';

@Component({
  selector: 'app-friendship-view',
  templateUrl: './friendship-view.component.html',
  styleUrls: ['./friendship-view.component.css']
})
export class FriendshipViewComponent implements OnInit {
  myUsername: string;
  friends = new Array<Friend>();
  filteredFriends = new Array<Friend>();

  constructor(public service: RegularUserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.myUsername = params['UserName'];
    });

    this.loadFriends();
  }

  //#region 1 - Metoda za ucitavanje prijatelja
  loadFriends(): void {
    this.service.loadMyFriends(this.myUsername).subscribe(
      (res: any) => {
        for(var i = 0; i< res.length; i++){
          this.friends.push(new Friend(res[i].username, res[i].firstname, res[i].lastname, res[i].phonenumber));
        }

        this.filteredFriends = this.friends;
      },
      err => {
        console.log(err);
        if(err.error === "Loading friends failed. Server not found you in database"){
          alert("Loading friends failed. Server not found you in database");
        }
        else if(err.error === "Loading frineds failed becaouse current user not have any friend."){
          alert("Loading frineds failed becaouse current user not have any friend.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
  //#region 2 - Metode za filtriranje aviokompanija
  filterFriends(){
    let filterParams = new Array<AbstractFilterParam>();
    if (this.getFilterFieldValue("firstNameFilter")) {
      filterParams.push(this.addFirstNameFilterParam());
    }
    if (this.getFilterFieldValue("lastNameFilter")) {
      filterParams.push(this.addLastNameFilterParam());
    }

    this.filteredFriends = this.service.filterFriends(this.friends, filterParams);
    console.log(this.filteredFriends);
  }

  resetFilter(): void {
    this.filteredFriends = this.friends;
  }

  getFilterFieldValue(filterFieldId: string){
    return (<HTMLInputElement> document.getElementById(filterFieldId)).value;
  }

  addFirstNameFilterParam(): ReturnType<any> {
    console.log(this.filteredFriends);
    return new StringFilterParam("firstNameFilter", this.getFilterFieldValue("firstNameFilter"));
  }

  addLastNameFilterParam(): ReturnType<any> {
    return new StringFilterParam("lastNameFilter", this.getFilterFieldValue("lastNameFilter"));
  }
  //#endregion
  //#region 3 - Metoda za brisanje prijatelja
  deleteFriend(friend: any){
    this.service.deleteFriend(this.myUsername, friend.username).subscribe(
      (res: any) => {
        alert("Deleting successfuly.");
        this.filteredFriends = [];
        this.friends = [];
        this.loadFriends();
      },
      err => {
        if(err.error === "Deleting failed. Server not found you in base."){
          alert("Deleting failed. Server not found you in base.");
        }
        else if(err.error === "Deleting failed. Server not found friend for deleting."){
          alert("Deleting failed. Server not found friend for deleting.");
        }
        else if(err.error === "Deleting failed. These two user are not friends."){
          alert("Deleting failed. These two user are not friends.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }
  //#endregion
}
