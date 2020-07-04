// Mini api to connect to a FireBase datastore.
import firebase from "firebase";
import { runInThisContext } from "vm";
//import * from "firebase/firestore";

// Required for side-effects
require("firebase/firestore");

class FireStorage {
  constructor() {
    console.log("create new firestore!");
    this.config = {
      apiKey: "AIzaSyAdGhNvUkAKeMWhzPHfuoXPUC36gBj68wU",
      authDomain: "mvn-turk.firebaseapp.com",
      databaseURL: "https://mvn-turk.firebaseio.com",
      projectId: "mvn-turk",
      storageBucket: "",
      messagingSenderId: "83565157892",
      appId: "1:83565157892:web:9fff8e165c4e2651",
    };
  }
  connect() {
    // Initialize Firebase
    this.app = firebase.initializeApp(this.config);

    return firebase.firestore(this.app);
  }
}

export default new FireStorage();
