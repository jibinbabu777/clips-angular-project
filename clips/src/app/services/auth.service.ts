import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import IUser from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usercollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>

  constructor(private auth:AngularFireAuth,
    private db: AngularFirestore) {
      this.usercollection = db.collection('users')
      this.isAuthenticated$ = auth.user.pipe(
        map(user => !!user)
      )
      auth.user.subscribe(console.log);
     }

  public async createUser(userData: IUser){
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string)
      if(!userCred.user){
        throw new Error('User cant found')
      }
      await this.usercollection.doc(userCred.user.uid).set({
        name: userData.name,
        age: userData.age,
        email: userData.email,
        phonenumber: userData.phonenumber
      })
      await userCred.user.updateProfile({
        displayName : userData.name

      })
  }
}
