import * as dotenv from 'dotenv';


dotenv.config();

export const user = process.env.DB_USER;
console.log(user);
export const passwd = process.env.DB_PASSWORD;
export const db = process.env.DB_NAME;
export const secret = process.env.JWT_SECRET;

// A  export const firebaseConfig= process.env.FIREBASE_API_KEY

// A export const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: 'w8-silvia-garcia.firebaseapp.com',
//   projectId: 'w8-silvia-garcia',
//   storageBucket: 'w8-silvia-garcia.appspot.com',
//   messagingSenderId: '385379311314',
//   appId: '1:385379311314:web:b7a2fb3214b781136e170b',
// };
