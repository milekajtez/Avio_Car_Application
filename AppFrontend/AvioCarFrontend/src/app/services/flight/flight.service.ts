import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  readonly BaseURI = 'http://localhost:57382/api';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  newFlightForm = this.fb.group({
    StartTime: ['', Validators.required],
    EndTime: ['', Validators.required],
    StartLocation: ['', [Validators.required, Validators.pattern("[a-z A-Z]+")]],
    EndLocation: ['', [Validators.required, Validators.pattern("[a-z A-Z]+")]],
    FlightLength: ['', [Validators.required, Validators.pattern("[0-9]{1,6}")]],
    AdditionalInformation: ['',Validators.required],
    NumberOfTransfers: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    AllTransfers: ['', Validators.required],
    PlaneName: ['', Validators.required],
    LugageWeight: ['', [Validators.required,Validators.pattern("[0-9]+")]],
    Airline: ['', Validators.required]
  });

  addNewFlight() {
    var body = {
      StartTime: this.newFlightForm.value.StartTime,
      EndTime: this.newFlightForm.value.EndTime,
      StartLocation: this.newFlightForm.value.StartLocation,
      EndLocation: this.newFlightForm.value.EndLocation,
      FlightLength: this.newFlightForm.value.FlightLength,
      AdditionalInformation: this.newFlightForm.value.AdditionalInformation,
      NumberOfTransfers: this.newFlightForm.value.NumberOfTransfers,
      AllTransfers: this.newFlightForm.value.AllTransfers,
      PlaneName: this.newFlightForm.value.PlaneName,
      LugageWeight: this.newFlightForm.value.LugageWeight,
      AirlineID: this.newFlightForm.value.Airline
    }

    return this.http.post(this.BaseURI + '/LoadData/AddFlight', body);
  }
}
