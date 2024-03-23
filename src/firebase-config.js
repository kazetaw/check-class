import firebase from 'firebase/compat/app'; // Import the compat version
// If you're using Firebase Authentication

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBF0vmFl0obqFr8CAX_kCWm6xOMWICIu4I",
    authDomain: "classroom2-f1dec.firebaseapp.com",
    projectId: "classroom2-f1dec",
    storageBucket: "classroom2-f1dec.appspot.com",
    messagingSenderId: "654331543869",
    appId: "1:654331543869:web:d3abebe3649b9949bf4554",
    measurementId: "G-JBHJ9DM137"
};

const app = firebase.initializeApp(firebaseConfig);

export default app;