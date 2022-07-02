import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import * as firebaseui from 'firebaseui';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import firebase from 'firebase/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    // variable for our FirebaseAuthUI component / namespace 
    ui: firebaseui.auth.AuthUI

    // service for AngularFireAuth
    constructor( private afAuth: AngularFireAuth, 
                 private router: Router ) {
    }

    // need to configure what happens if log in successful 
    // need to specify which social log in methods to use 
    ngOnInit() {
        // app object is a promise 
        this.afAuth.app.then(app => {
            // config for which sign options are available
            const uiConfig = {
                signInOptions: [
                    EmailAuthProvider.PROVIDER_ID,
                    GoogleAuthProvider.PROVIDER_ID
                ], 
                // callback function if signin is successful  
                // binds the method to the instance of the LoginComponent
                // all references to the instance of this refer to the component
                callbacks: {
                    signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)
                }
            }; 
            // takes on argument which is the result of the promise above 
            this.ui = new firebaseui.auth.AuthUI(app.auth()); 

            // bootstrap the firebase librry 
            // pass in the id of the container div as a CSS selector from our HTML template 
            // pass in config as 2nd argument 
            this.ui.start("#firebaseui-auth-container", uiConfig); 

            // disables auto log in - not needed in production app really 
            this.ui.disableAutoSignIn(); 
        }); 
    }

    ngOnDestroy() {
        // destroys UI instance to prevent memory leaks 
        this.ui.delete(); 
    }

    // what to do if log in is successful 
    onLoginSuccessful(result) {
        this.router.navigateByUrl("/courses"); 
    }
}


