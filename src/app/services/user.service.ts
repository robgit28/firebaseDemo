import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

// ensures available across whole app 
@Injectable({
    providedIn: 'root',
})

export class UserService {
    isLoggedIn$: Observable<boolean>; 
    isLoggedOut$: Observable<boolean>; 
    pictureUrl$: Observable<string>; 

    // gives us access to the JWT, which has all the information on the user 
    constructor( private afAuth: AngularFireAuth, 
                 private router: Router ) {
        // the jwt, which proves who they are 
        // idToken is an observable, which we subscribe to
        afAuth.idToken.subscribe(jwt => console.log("JWT: ",  jwt)); 
        
        // all information on the user 
        // authState is an observable, which we subscribe to
        afAuth.authState.subscribe(auth => console.log("Auth: ",  auth)); 

        this.isLoggedIn$ = afAuth.authState.pipe(map(user => !!user)); 
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn)); 
        this.pictureUrl$ = afAuth.authState.pipe(map(user => user? user.photoURL : null)); 
    }

    logout() {
        this.afAuth.signOut();
        this.router.navigateByUrl('/login'); 
    }
}