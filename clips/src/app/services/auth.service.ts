import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, filter, map, switchMap } from 'rxjs/operators'
import IUser from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usercollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>
  private redirect = false;

  constructor(private auth:AngularFireAuth,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute) {
      this.usercollection = db.collection('users')
      this.isAuthenticated$ = auth.user.pipe(
        map(user => !!user)
      )
      auth.user.subscribe(console.log);
      this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
        //delay of 1 second for user to understand he logged in
        delay(1000)
      )
      this.router.events.pipe(filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({})))
      .subscribe(data => {this.redirect = data['authOnly'] ?? false})
            
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

  async logOut($event?: Event){
    if($event){
      $event.preventDefault()
    }

    await this.afAuth.signOut();
    if(this.redirect){
      await this.router.navigateByUrl('/');
    }

  }
}
