// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // set to false if need to connect to live DB 
  // set to true if need to connect to emulator / local DB 
  useEmulators: true, 
  // details ot our real cloud DB here... 
  firebase: {
    apiKey: "AIzaSyAhXdSProPsdUCZY6n8nFLPRO5yL0TIfOA",
    authDomain: "fir-tutorial-b71a5.firebaseapp.com",
    projectId: "fir-tutorial-b71a5",
    storageBucket: "fir-tutorial-b71a5.appspot.com",
    messagingSenderId: "730882582629",
    appId: "1:730882582629:web:0fdf7e398f6fbef1b27e8c"
  },
  api: {

  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
