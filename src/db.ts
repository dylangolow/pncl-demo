import * as admin from 'firebase-admin';

const serviceAccount = require('../credentials.json');
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://pncl-demo.firebaseio.com",
        storageBucket: "https://pncl-demo.appspot.com"
    });
    console.log(`GOOGLE_CLOUD_PROJECT: ${process.env.GOOGLE_CLOUD_PROJECT}`);
} catch (e) {}

export default admin;
export const db = admin.firestore();

