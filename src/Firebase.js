import firebase from 'firebase';

const firebaseapp =firebase.initializeApp({
    apiKey: "AIzaSyBQVyCNpb4YWxkfP8qqkyUxySGaOwrADlM",
    authDomain: "instagram-clone-reactjs-5ea15.firebaseapp.com",
    databaseURL: "https://instagram-clone-reactjs-5ea15-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-reactjs-5ea15",
    storageBucket: "instagram-clone-reactjs-5ea15.appspot.com",
    messagingSenderId: "808736086822",
    appId: "1:808736086822:web:0a2691efa886014a49bfe7"
  });

  const db=firebase.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();
  export {db,auth,storage}