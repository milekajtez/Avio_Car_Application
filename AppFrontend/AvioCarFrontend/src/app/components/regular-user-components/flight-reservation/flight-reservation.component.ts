import { Component, OnInit } from '@angular/core';
import { RegularUserService } from 'src/app/services/regular-user/regular-user.service';
import { Flight } from 'src/app/entities/avio-entities/flight/flight';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { AbstractFilterParam } from 'src/app/entities/abstract-filter-param/abstract-filter-param';
import { NumberFilterParam } from 'src/app/entities/number-filter-param/number-filter-param';
import { Ticket } from 'src/app/entities/avio-entities/ticket/ticket';
import { Friend } from 'src/app/entities/regular-user-entities/friend/friend';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-reservation',
  templateUrl: './flight-reservation.component.html',
  styleUrls: ['./flight-reservation.component.css']
})
export class FlightReservationComponent implements OnInit {
  myUsername: string;
  allFlights = new Array<Flight>();               // lista svih letova
  searchedFlights = new Array<Flight>();          // lista svih pronadjenih letova
  filteredFlights = new Array<Flight>();          // lista filtriranih letova
  flightSeats = new Array<Ticket>();              // lista mesta izabranog leta
  selectedSeats = new Array<Ticket>();            // lista selektovanih mesta
  myFriends = new Array<Friend>();                // lista svih prijatelja
  chosenFriends = new Array<Friend>();            // lista izabranih prijatelja
  flightID: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string
  flightTime: string;
  flightLength: string;
  flightRating: string;
  adittionalInformation: string;
  numberOfTransfers: string;
  allTransfers: string;
  planeName:string;
  laguageWeight: string;

  constructor(public service: RegularUserService, public loadService: LoadDataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadFlights();
    this.route.params.subscribe(params => {
      this.myUsername = params['UserName'];
    });

  }

  clearModalData(){
    this.myFriends = [];
    this.chosenFriends = [];
    this.flightSeats = [];
    this.selectedSeats = [];
  }

  //#region 1 - Metoda za ucitavanje svih letova
  loadFlights(): void {
    this.loadService.loadFlights().subscribe(
      (res: any) => {
        console.log(res);
        var rating;
        for(var i = 0; i < res.length; i++){
          if(res[i].numberOfFlightGrades === 0){
            rating = 0;
          }
          else{
            rating = Number(res[i].flightPrice) / Number(res[i].numberOfFlightGrades);
          }

          this.allFlights.push(new Flight(res[i].flightID, res[i].startTime, res[i].endTime, res[i].startLocation,
            res[i].endLocation, res[i].flightTime, res[i].flightLength, rating, res[i].additionalInformation, 
            res[i].numberOfTransfers, res[i].allTransfers, res[i].planeName, res[i].lugageWeight));
        }
      },
      err => {
        console.log(err);
        alert("Loading flight failed.");
      }
    );
  }
  //#endregion
  //#region 2 - Metoda za pretragu letova prema odredjenim parametrima i metoda resetovanje forme
  searchFlights(){
    this.searchedFlights = this.allFlights;
    if((this.service.searchFlightForm.value.StartLocation === "" && this.service.searchFlightForm.value.EndLocation === "" &&
        this.service.searchFlightForm.value.StartTime === "") || this.service.searchFlightForm.value.StartLocation == null && 
        this.service.searchFlightForm.value.EndLocation == null && this.service.searchFlightForm.value.StartTime == null){
      alert("Searching failed. You not entered any info in form for searching flights.");
    }
    else{
      if(this.service.searchFlightForm.value.StartLocation != null){
        if(this.service.searchFlightForm.value.StartLocation !== ""){
          this.searchedFlights = this.searchedFlights.filter(item => item.startLocation === this.service.searchFlightForm.value.StartLocation);
        }
      }
      if(this.service.searchFlightForm.value.EndLocation != null){
        if(this.service.searchFlightForm.value.EndLocation !== ""){
          this.searchedFlights = this.searchedFlights.filter(item => item.endLocation === this.service.searchFlightForm.value.EndLocation);
        }
      }
      if(this.service.searchFlightForm.value.StartTime != null){
        if(this.service.searchFlightForm.value.StartTime !== ""){
          this.searchedFlights = this.searchedFlights.filter(item => item.startTime === (this.service.searchFlightForm.value.StartTime + ":00"));
        }
      }

      if(this.searchedFlights.length == 0){
        alert("No flight with the specified parameters was found.");
      }

      this.filteredFlights = this.searchedFlights;
    }
  }
  
  resetSearch(){
    this.service.searchFlightForm.reset();
    this.filteredFlights = [];
    this.searchedFlights = [];
  }
  //#endregion
  //#region 3 - MEtode za filtriranje letova
  filterFlight(){
    let filterParams = new Array<AbstractFilterParam>();
    if (this.getFilterFieldValue("laguageWeightFilter")) {
      filterParams.push(this.addLaguageWeightFilterParam());
    }
    if (this.getFilterFieldValue("flightTimeFilter")) {
      filterParams.push(this.addFlightTimeFilterParam());
    }
    if (this.getFilterFieldValue("flightLengthFilter")) {
      filterParams.push(this.addFlightLengthgFilterParam());
    }

    this.filteredFlights = this.service.filterFlights(this.searchedFlights, filterParams);
  }

  resetFilter(){
    this.filteredFlights = this.searchedFlights;
  }

  getFilterFieldValue(filterFieldId: string){
    return (<HTMLInputElement> document.getElementById(filterFieldId)).value;
  }

  addLaguageWeightFilterParam(): ReturnType<any> {
    return new NumberFilterParam("laguageWeightFilter", +this.getFilterFieldValue("laguageWeightFilter"));
  }

  addFlightTimeFilterParam(): ReturnType<any> {
    return new NumberFilterParam("flightTimeFilter", +this.getFilterFieldValue("flightTimeFilter"));
  }

  addFlightLengthgFilterParam(): ReturnType<any> {
    return new NumberFilterParam("flightLengthFilter", +this.getFilterFieldValue("flightLengthFilter"));
  }
  //#endregion

  //#region 4 - Metoda za otvaranje modala za rezervaciju leta
  flightReservation(flight: any){
    this.flightID = flight.flightID;
    this.startTime = flight.startTime;
    this.endTime = flight.endTime;
    this.startLocation = flight.startLocation;
    this.endLocation = flight.endLocation;
    this.flightTime = flight.flightTime;
    this.flightLength = flight.flightLength;
    this.flightRating = flight.flightRating;
    this.adittionalInformation = flight.adittionalInformation;
    this.numberOfTransfers = flight.numberOfTransfers;
    this.allTransfers = flight.allTransfers;
    this.planeName = flight.planeName;
    this.laguageWeight = flight.laguageWeight;

    // resetovanje svih listi
    this.clearModalData();

    // ucitavam sedista trenutnog leta
    this.loadFlightSeats(flight.flightID);

    // ucitavam sve moje prijatelje
    this.loadMyFriends(this.myUsername);

  }
  //#endregion
  //#region 5 - Metoda za ucitavanje svih sedista izabranog leta
  loadFlightSeats(flightID: string){
    this.loadService.loadTickets(flightID).subscribe(
      (res: any) => {
        this.flightSeats = [];
        for(var i = 0; i < res.length; i++){
          var type: string;
          if(res[i].cardType == "0"){
            type = "ECONOMIC";
          }
          else if(res[i].cardType == "1"){
            type = "FIRST";
          }
          else{
            type = "BUSINESS";
          }

          this.flightSeats.push(new Ticket(res[i].ticketID, res[i].ticketNumber, res[i].ticketPrice, type, res[i].timeOfTicketPurchase,
            res[i].isTicketPurchased, res[i].isQuickBooking));

          this.flightSeats.sort(function(a: any, b: any){
            return a.ticketNumber - b.ticketNumber;
          });
        }
      },
      err => {
        console.log(err);
        if(err.error === "Currently this flight not have any ticket."){
          alert("Currently this flight not have any ticket.");
        }
        else{
          alert("Unknown error.");
        }

        this.flightSeats = [];
      }
    );
  }
  //#endregion
  //#region 6 - Metoda za ucitavanje svih mojih prijatelja i metoda za resetovanje forme za biranje prijatelja
  loadMyFriends(username: string){
    this.service.loadMyFriends(this.myUsername).subscribe(
      (res: any) => {
        this.myFriends = [];
        for(var i = 0; i< res.length; i++){
          this.myFriends.push(new Friend(res[i].username, res[i].firstname, res[i].lastname, res[i].phonenumber));
        }

      },
      err => {
        console.log(err);
        if(err.error === "Loading friends failed. Server not found you in database"){
          alert("Loading friends failed. Server not found you in database");
        }
        else if(err.error === "Loading frineds failed becaouse current user not have any friend."){
          alert("Loading friends failed becaouse current user not have any friend.");
        }
        else{
          alert("Unknown error.");
        }
      }
    );
  }

  resetChooseFriendForm(){
    this.service.chooseFriendForm.reset();
  }
  //#endregion

  //#region 7 - Metoda za dodavanje prijatelja u listu selektovanih prijatelja (ukoliko je dobro ukucan passport i username)
  chooseFriend(){
    // treba <= ()stavio sam > da vidim da li radi else deo !!!
    if(this.selectedSeats.length > 1){
      alert("You must select 2 or more seats.");
    }
    else{
      // provera username-a
      var isFriend = this.myFriends.filter(f => f.username === this.service.chooseFriendForm.value.Friend);
      if(isFriend.length === 0){
        alert("Please insert different username. No friends have entered a username or you already chosen this friend.");
      }
      else{
        // provera pasosa
        this.service.checkPassport(this.service.chooseFriendForm.value.Friend, this.service.chooseFriendForm.value.FriendPassport).subscribe(
          (res: any) => {
            console.log(res);
            this.chosenFriends.push(new Friend(res.userName, res.firstName, res.lastName, res.phoneNumber));

            // osvezavam listu prijatelja koje mogu da selektujem
            this.myFriends = this.myFriends.filter(h => h.username !== res.userName);
            this.service.chooseFriendForm.reset();
          },
          err => {
            console.log(err);
            if(err.error === "Checking passport failed. Server not found user with this username."){
              alert("Checking passport failed. Server not found user with this username.");
            }
            else if(err.error === "Passport is incorrect. Please enter a different number of passport."){
              alert("Passport is incorrect. Please enter a different number of passport.");
            }
            else if(err.error === "Current user not has passport number yet."){
              alert("Current user not has passport number yet.");
            }
            else{
              alert("Unknown error.");
            }
          }
        );
      }
    }
  }
  //#endregion
  //#region 8 - Metoda za brisanje prijatelja iz tabele izabranih za rezervaciju
  deleteChosenFriend(friend: any){
    this.chosenFriends = this.chosenFriends.filter(f => f.username != friend.username);
    this.myFriends.push(friend);
  }
  //#endregion
  
  
  
  selectSeats(){
    // metoda za selektovanje polja
  }

  
}
