const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

module.exports = {
  connect: function () {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyAdGhNvUkAKeMWhzPHfuoXPUC36gBj68wU",
      authDomain: "mvn-turk.firebaseapp.com",
      databaseURL: "https://mvn-turk.firebaseio.com",
      projectId: "mvn-turk",
      storageBucket: "",
      messagingSenderId: "83565157892",
      appId: "1:83565157892:web:9fff8e165c4e2651"
    };
    // Initialize Firebase
    let app = firebase.initializeApp(firebaseConfig);

    db = firebase.firestore(app);
    return db;
  },
};