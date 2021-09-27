import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyD5Uc-5GPi93gvNnJdVhl5E_WMW1ng_uQQ",
    authDomain: "whatsapp-2-6c0ef.firebaseapp.com",
    projectId: "whatsapp-2-6c0ef",
    storageBucket: "whatsapp-2-6c0ef.appspot.com",
    messagingSenderId: "681481518205",
    appId: "1:681481518205:web:ebdd9a15d7e33f3f0ac514"
};

const app = !firebase.apps.length ?
    firebase.initializeApp(firebaseConfig) :
    firebase.app()

const db = firebase.firestore();

const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };