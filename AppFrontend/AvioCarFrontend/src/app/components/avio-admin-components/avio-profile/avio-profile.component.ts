import { Component, OnInit, Input } from '@angular/core';
import { LoadDataService } from 'src/app/services/load-data/load-data.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-avio-profile',
  templateUrl: './avio-profile.component.html',
  styleUrls: ['./avio-profile.component.css']
})
export class AvioProfileComponent implements OnInit {
  username: string;
  email: string;
  phonenumber: string;
  firstname: string;
  lastname: string;
  city: string;

  constructor(public service: LoadDataService, private toastr: ToastrService, private route: ActivatedRoute) 
  {
    route.params.subscribe(params => {
      this.username = params['UserName'];
    });
   }

  ngOnInit(): void {
    this.initializeAvioAdminData();
  }

  initializeAvioAdminData() : void {
    this.service.loadAvioAdmin(this.username).subscribe(
      (res: any) => {
        // imacu u html-u mesta (npr tabela) i tu cu stavljati podatke
        console.log(res);
        this.email = res.email;
        this.phonenumber = res.phoneNumber;
        this.firstname = res.firstName;
        this.lastname = res.lastName;
        this.city = res.city;
      },
      err => {
        alert("Loading current avio admin is unsuccessfully.");
      }
    );
  }

  onSubmit() : void {
    // TO DO: obraditi odgovor i pozvati ponovno ucitavanje azuriranih podataka
  }

  changePassword(): void {
    // TO DO: obraditi odgovor
  }

}
