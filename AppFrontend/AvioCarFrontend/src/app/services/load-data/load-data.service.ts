import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {
  readonly BaseURI = 'http://localhost:57382/api';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  form1 = this.fb.group({
    AirlinePlusCar: ['', Validators.required]
  });

  form2 = this.fb.group({
    Points300: ['', Validators.required]
  });

  form3 = this.fb.group({
    Points600: ['', Validators.required]
  });

  form4 = this.fb.group({
    Points1200: ['', Validators.required]
  });

  loadDiscounts() {
    return this.http.get(this.BaseURI + '/LoadData/GetDiscounts');
  }

  changeDiscount(body){
    return this.http.put(this.BaseURI + '/LoadData/ChangeDiscount', body);
  }
}
