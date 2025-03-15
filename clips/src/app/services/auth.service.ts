import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, filter, map, switchMap } from 'rxjs/operators'
import IUser from '../models/user.model';
//AngularFireAuth - Authentication
//AngularFireStore, AngularFireStoreCollection - to store data


@Injectable({
  providedIn: 'root'
})
// This is an Angular authentication service (AuthService) that manages user authentication using Firebase Authentication and Firestore. 
// It provides methods for user sign-up, authentication state management, and logout.

export class AuthService {
  private usercollection: AngularFirestoreCollection<IUser> // A Firestore collection to store user details.
  public isAuthenticated$: Observable<boolean> //Observable that emits true if the user is logged in, otherwise false.
  public isAuthenticatedWithDelay$: Observable<boolean> // Same as isAuthenticated$, but with a 1-second delay.
  private redirect = false; //A flag that determines if the user should be redirected after logout.

  constructor(private auth:AngularFireAuth,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute) {
      this.usercollection = db.collection('users') // Creates a reference to the users collection in Firestore.
      this.isAuthenticated$ = auth.user.pipe( //emits the currently logged-in user.
        map(user => !!user)//converts the user object into a boolean (true if logged in, false if not).
      )
      auth.user.subscribe(console.log);
      this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
        //delay of 1 second for user to understand he logged in
        delay(1000)
      )
      this.router.events.pipe(filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({})))
      .subscribe((data:any) => {this.redirect = data['authOnly'] ?? false})
            
     }

     //This method registers a new user and saves their information in Firestore.
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
