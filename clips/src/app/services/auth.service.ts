import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usercollection: AngularFirestoreCollection<IUser>

  constructor(private auth:AngularFireAuth,
    private db: AngularFirestore) {
      this.usercollection = db.collection('users')
     }

  public async createUser(userData: IUser){
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string)
      await this.usercollection.add({
        name: userData.name,
        age: userData.age,
        email: userData.email,
        phonenumber: userData.phonenumber
      })
  }
}
