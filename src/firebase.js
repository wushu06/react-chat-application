import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyCigg8KEACxbirgAmqeYf7dsIo981WiNks",
    authDomain: "hup-mui.firebaseapp.com",
    databaseURL: "https://hup-mui.firebaseio.com",
    projectId: "hup-mui",
    storageBucket: "hup-mui.appspot.com",
    messagingSenderId: "265263201088"
};
firebase.initializeApp(config);

export default firebase;