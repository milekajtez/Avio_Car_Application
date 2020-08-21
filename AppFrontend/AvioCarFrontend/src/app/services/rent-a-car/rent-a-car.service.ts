import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RentACarService {
  readonly BaseURI = 'http://localhost:57382/api';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  addBranchForm = this.fb.group({
    RentACarService: ['', Validators.required],
    BranchOfficeAddress: ['', Validators.required],
    City: ['', Validators.required],
    Country: ['',Validators.required]
  });

  deleteBranchForm = this.fb.group({
    BranchOffice: ['', Validators.required]
  });

  changeBranchForm = this.fb.group({
    BranchOffice: ['', Validators.required],
    BranchOfficeAddress: [''],
    City: [''],
    Country: ['']
  });

  // metoda za ucitavanje svih rent-a-car servisa
  loadRentACarServices() {
    return this.http.get(this.BaseURI + '/RentACar/GetRentACarServices');
  }

  // metoda za ucitavanje svih filijala
  loadBranchOffices() {
    return this.http.get(this.BaseURI + '/RentACar/GetBranchOffices');
  }

  // metoda za dodavanje nove filijale
  addNewBranch(){
    var body = {
      RentACarServiceID: this.addBranchForm.value.RentACarService,
      BranchOfficeAddress: this.addBranchForm.value.BranchOfficeAddress,
      City: this.addBranchForm.value.City,
      Country: this.addBranchForm.value.Country
    }

    return this.http.post(this.BaseURI + '/RentACar/AddBranchOffice', body);
  }

  // metoda za brisanje filijale
  deleteBranch(branchOfficeID: string){
    return this.http.delete(this.BaseURI + '/RentACar/DeleteBranchOffice/' + branchOfficeID);
  }

  // metoda za izmenu filijale
  changeBranchOffice(){
    var body = {
      RentACarServiceID: this.changeBranchForm.value.BranchOffice,
      BranchOfficeAddress: this.changeBranchForm.value.BranchOfficeAddress,
      City: this.changeBranchForm.value.City,
      Country: this.changeBranchForm.value.Country
    }

    // RentACarServiceID je ustvari u ovom slucaj id filijale..ove sam stavio ovaj naziv da ne moram da pravim novu klasu
    // koja ce primati poruke samo zbog jednog polja

    return this.http.put(this.BaseURI + '/RentACar/ChangeBranchOffice/', body);
  }

}
