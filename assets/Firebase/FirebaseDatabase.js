import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDRNRHRSMKX_IMS7Tp118bpA-AxkLv1mWQ",
    authDomain: "arkbase-300520.firebaseapp.com",
    databaseURL: "https://arkbase-300520.firebaseio.com",
    projectId: "arkbase-300520",
    storageBucket: "arkbase-300520.appspot.com",
    messagingSenderId: "590435218387",
    appId: "1:590435218387:web:b8281bbbc395d09fec3526"
  };

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;