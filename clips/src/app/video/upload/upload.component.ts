import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  isDragover = false;
  file : File | null = null;
  nextStep = false;
  showAlert = false;
  alertColor = "blue";
  alertMsg = "Please wait";
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null
  title = new FormControl('',[Validators.required, Validators.minLength(3)])
  uploadForm = new FormGroup({
    title : this.title
  })
  constructor(private storage: AngularFireStorage,
    private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  storeFile($event:Event){
    this.isDragover = false
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    if(!this.file || this.file.type !== 'video/mp4'){
      return
    }
   this.title.setValue(
    this.file.name.replace('/\.[^.]*$/', '')
   )

  
  this.nextStep = true;
   }

  uploadFile(){
    this.showAlert = true;
    this.alertColor = "blue";
    this.alertMsg = "Please wait! Your clip is uploaded";
    this.inSubmission = true;
    this.showPercentage = true;
    const clipName = uuid();
    const clipPath = `clips/${clipName}.mp4`
    const task = this.storage.upload(clipPath, this.file)
    task.percentageChanges().subscribe(progress =>
      this.percentage = progress as number / 100
      )
    task.snapshotChanges().pipe(last()).subscribe({
      next: (snapshot)=>{
        this.alertColor = "green";
        this.alertMsg = "Success😍!!!";
        this.showPercentage= false
      },
      error: (error) =>{
        this.alertColor = "red";
        this.alertMsg = "Upload Failed🥲 Please try again later.";
        this.inSubmission = true;
        this.showPercentage = false;

      }
      
    })
  }

}
