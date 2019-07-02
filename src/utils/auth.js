import firebase from "firebase";

const config = {
    apiKey: "",
    authDomain: "example-app-fd690.firebaseapp.com",
    databaseURL: "https://example-app-fd690.firebaseio.com",
    projectId: "example-app-fd690",
    storageBucket: "example-app-fd690.appspot.com",
    messagingSenderId: ""
};

firebase.initializeApp(config);

export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
