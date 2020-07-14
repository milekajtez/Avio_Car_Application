import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registeredUsers: any[] = [];

  registerForm: FormGroup;              //grupa u koju su ddata polja forme
  
  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  register() {
    /*this.registeredUsers.push(this.registerForm.value);
    localStorage.setItem('sessionUser', JSON.stringify('USER'));
    console.log(this.registerForm.value);*/
  }

  cancel() {
    this.cancelRegister.emit(false);
    /*console.log('cancelled');*/
  }

  //metoda za inicijalizaciju forme i autorizacije i tipa validacije svakog polja
  private initForm() {
    this.registerForm = new FormGroup({
      'username': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', [Validators.required, Validators.minLength(13)]),
      'passworRepeat': new FormControl('', [Validators.required, Validators.minLength(13)]),
      'firstName': new FormControl('', Validators.required),
      'secondName': new FormControl('', Validators.required),
      'jmbg': new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
      'city': new FormControl('', Validators.required),
      'telephone': new FormControl('', Validators.required)
    });
  }

}
