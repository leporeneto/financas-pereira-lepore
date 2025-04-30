import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBD21CdmT5YukoHzwB3Zm2zbwHuKdoOlYY",
  authDomain: "financeiropereiralepore.firebaseapp.com",
  databaseURL: "https://financeiropereiralepore-default-rtdb.firebaseio.com",
  projectId: "financeiropereiralepore",
  storageBucket: "financeiropereiralepore.appspot.com",
  messagingSenderId: "601293313257",
  appId: "1:601293313257:web:b142eb751b4acb635ecc78"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, ref, set, push, get, child, auth, onAuthStateChanged };
