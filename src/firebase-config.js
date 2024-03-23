import firebase from 'firebase/compat/app'; // Import the compat version
 // If you're using Firebase Authentication

const firebaseConfig = {
    apiKey: "AIzaSyAsMeRAS9P8AK9NbHfyRzkfSfFzVsGu2e4",
    authDomain: "classroom-456cd.firebaseapp.com",
    projectId: "classroom-456cd",
    storageBucket: "classroom-456cd.appspot.com",
    messagingSenderId: "716575161448",
    appId: "1:716575161448:web:7a673024cd9d5376088fdd",
    measurementId: "G-59W1SQFJ42"
};

const app = firebase.initializeApp(firebaseConfig);

export default app;