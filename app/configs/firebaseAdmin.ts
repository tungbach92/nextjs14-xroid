import {IS_PRODUCTION} from "@/app/configs/constants";
import admin from 'firebase-admin';
import {initializeApp} from 'firebase-admin/app';
// import prod_Geniam_ServiceAccount from './geniam-prod.json'
// import dev_Geniam_ServiceAccount from './geniam-dev.json'
import {getAuth} from "firebase-admin/auth";

// export const geniamAdminApp = initializeApp({
//   credential: admin.credential.cert(
// // @ts-ignore
//     IS_PRODUCTION ?
//       prod_Geniam_ServiceAccount
//       : dev_Geniam_ServiceAccount,
//   ),
// }, 'geniamAdmin2w');
//
// export const auth = getAuth(geniamAdminApp)

