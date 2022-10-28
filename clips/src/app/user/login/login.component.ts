import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { bufferToggle } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  credentials = {
    email : '',
    password : ''
  }

  constructor(private auth: AngularFireAuth){
    
  }

  alertMsg = "Please wait"
  showAlert = false;
  inSubmission = false;
  alertColor = "blue";

  async login(){
    this.alertMsg="Please wait";
    this.showAlert = true;
    this.inSubmission = true;
    this.alertColor="blue"
    
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    } catch (e) {     
      this.alertMsg="Error occured";
      this.inSubmission = false;
      this.alertColor="red"
      return
    }
    this.alertMsg="Login Successfully"
    this.alertColor="green"
  }
  

  formGroup = new FormGroup({

  })
}
