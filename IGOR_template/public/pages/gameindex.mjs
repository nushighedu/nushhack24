import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAS0LLXuS6Bsna-15pS-XZ84oCY2LN4-24",
    authDomain: "igor-shell.firebaseapp.com",
    databaseURL: "https://igor-shell-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "igor-shell",
    storageBucket: "igor-shell.firebasestorage.app",
    messagingSenderId: "641035943268",
    appId: "1:641035943268:web:d288a2b10deaa5fd8e0e71",
    measurementId: "G-08D0EC4B32"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

signInBtn.onclick = () => {
    signInWithPopup(auth, provider)
        .then((result) => console.log(result))
        .catch((error) => console.log(error))
};

signOutBtn.onclick = () => auth.signOut();

onAuthStateChanged(auth, (user) => {
    if (user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `
            <div class="userInfoContainer">
                <p>${user.displayName}</p>
                <span class="tooltiptext">User ID: ${user.uid}</span>
            </div>
        `;
        document.getElementById('signOutBtn').onclick = () => auth.signOut();
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = "";
    }
});
