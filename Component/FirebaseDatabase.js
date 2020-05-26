import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCL7ESTEvhsatoZNBtc6qLZySotQFEBUEs",
    authDomain: "arkbase-250520.firebaseapp.com",
    databaseURL: "https://arkbase-250520.firebaseio.com",
    projectId: "arkbase-250520",
    storageBucket: "arkbase-250520.appspot.com",
    messagingSenderId: "975226992003",
    appId: "1:975226992003:web:996f1967e9ba30a673b2b6",
    measurementId: "G-ZT7QLEDGXF"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;