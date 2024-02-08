import {initializeApp} from 'firebase/app';
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";
import {IS_PRODUCTION} from "@/app/configs/constants";
import {getFirestore} from "@firebase/firestore";

// TODO: change firebase config here
const firebaseConfig_geniam = IS_PRODUCTION ?
  {
    apiKey: 'AIzaSyBROAxpDRqRIqZvrAGE7UK7uvaIUcxooS0',
    authDomain: 'geniam-c8d4c.firebaseapp.com',
    databaseURL: 'https://geniam-c8d4c.firebaseio.com',
    projectId: 'geniam-c8d4c',
    storageBucket: 'geniam-c8d4c.appspot.com',
    messagingSenderId: '92022981782',
    appId: '1:92022981782:web:17a2ab710f867e60b56eb7',
    measurementId: 'G-ZZVDYP9EN4',
  }
  :
  {
    apiKey: "AIzaSyD84J67YueP6HvVXbJtime2VaKnc3M1ZlE",
    authDomain: "geniam-dev.firebaseapp.com",
    projectId: "geniam-dev",
    storageBucket: "geniam-dev.appspot.com",
    messagingSenderId: "469887895881",
    appId: "1:469887895881:web:507ee859696cf3f9b5b298",
    measurementId: "G-8VDE2ZHNW7"
  }

// config to default firebase 1
const app_geniam = initializeApp(firebaseConfig_geniam);
export const auth = getAuth(app_geniam)

// config to firebase 2
const firebaseConfig_mentoroid = IS_PRODUCTION ?
  {
    apiKey: "AIzaSyDXedKG4ts5rwmpygZUnzruYYGwxdHKyxg",
    authDomain: "togo-a2894.firebaseapp.com",
    databaseURL: "https://togo-a2894.firebaseio.com",
    projectId: "togo-a2894",
    storageBucket: "togo-a2894.appspot.com",
    messagingSenderId: "1069041587578",
    appId: "1:1069041587578:web:833b623562f328cfc832c3"
  }
  :
  {
    apiKey: "AIzaSyD12F_SEIQFo0dFKrsaN6-wUsZY0m5ngU4",
    authDomain: "mentoroid-dev.firebaseapp.com",
    projectId: "mentoroid-dev",
    storageBucket: "mentoroid-dev.appspot.com",
    messagingSenderId: "1094401664380",
    appId: "1:1094401664380:web:5ea053d996a4f4b00f30f9",
    measurementId: "G-LXN25Q5488"
  }
const app_mentoroid = initializeApp(firebaseConfig_mentoroid, "secondary");
export const db = getFirestore(app_mentoroid);
export const storage = getStorage(app_mentoroid)

export default app_mentoroid
if (typeof window !== "undefined") {
  window['__auth'] = auth;
}

