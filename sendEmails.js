const admin = require("firebase-admin");
const emailjs = require("@emailjs/browser");
require('dotenv').config(); // Load environment variables from .env file


// Load Firebase service account key from environment variable
// console.log("Printing env ",process.env);
// console.log("Printing env ",process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const serviceAccountKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8');
const serviceAccount = JSON.parse(serviceAccountKey);



const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCfbqC-893YBqhgR5OR0eHyX-EXzCIoTC8",
  authDomain: "jwdatabase-f0e20.firebaseapp.com",
  databaseURL: "https://jwdatabase-f0e20-default-rtdb.firebaseio.com",
  projectId: "jwdatabase-f0e20",
  storageBucket: "jwdatabase-f0e20.appspot.com",
  messagingSenderId: "1335908909",
  appId: "1:1335908909:web:0c132d7c79008c490c36a4",
  measurementId: "G-BQG1N754TN"
};

const EMAILJS_SERVICE_ID = 'service_jitwsrj';

const EMAILJS_TEMPLATE_ID = 'template_m0u22pm';

const EMAILJS_USER_ID = 'qcbXaXrWGMaIRt6_o';



// Load Firebase config from environment variables
console.log(process.env);
const firebaseConfig = FIREBASE_CONFIG;
//const firebaseConfig = JSON.parse(FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function sendEmails() {
  console.log("Sending emails...");
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  try {
    const snapshot = await db.collection("Event").get();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.Date === todayFormatted) {
        const message = `Happy ${data.Occasion}, ${data.To_Name}!`;
        sendEmail(data.To_Email, message, `Happy ${data.Occasion}!`);
      }
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

function sendEmail(toEmail, message, subject) {
  emailjs.init(EMAILJS_USER_ID);
  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      message,
      subject,
      to_email: toEmail,
    })
    .then(() => console.log("Email sent!"))
    .catch((error) => console.error("Error sending email:", error));
}

sendEmails();
