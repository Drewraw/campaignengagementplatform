import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-NuhEIDr1H1W2zojPqm18L3VdiWl5xlU",
  authDomain: "pro2-5f35b.firebaseapp.com",
  projectId: "pro2-5f35b",
  storageBucket: "pro2-5f35b.appspot.com",
  messagingSenderId: "23053695380",
  appId: "1:23053695380:web:d563713ad462f1b408b781"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { firebase, auth, firestore };
