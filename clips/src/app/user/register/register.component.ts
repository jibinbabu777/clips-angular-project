import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {

  name= new FormControl('',[Validators.required,Validators.minLength(3)])
  email= new FormControl('',[Validators.required,Validators.email])
  age= new FormControl('',[Validators.required,Validators.min(18),Validators.max(120)])
  password= new FormControl('',
  [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)])
  confirm_password= new FormControl('',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)])
  phonenumber= new FormControl('',
  [Validators.required,Validators.minLength(13),Validators.maxLength(13)])

  constructor(
    private auth: AuthService
    ){

  }

registerForm = new FormGroup({
  name : this.name,
  email: this.email,
  age : this.age,
  password : this.password,
  confirm_password :this.confirm_password,
  phonenumber : this.phonenumber
})

showAlert = false;
alertColor = "blue";
alertMsg = "Please wait, Account Created"


async register(){
  this.showAlert=true;
  this.alertColor = "blue";
  this.alertMsg = "Please wait, Account Created"
  try{
   this.auth.createUser(this.registerForm.value);
  }catch(e){
    console.log(e);
    this.alertMsg='Please try again later';
    this.alertColor='red'
    return
  }
  this.alertMsg='Account created SuccessFully';
  this.alertColor='green'
}
}
