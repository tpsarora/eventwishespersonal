const admin = require("firebase-admin");
const emailjs = require("@emailjs/browser");

// Load Firebase config from environment variables
console.log(process.env);
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

const db = admin.firestore();

async function sendEmails() {
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
  emailjs.init(process.env.EMAILJS_USER_ID);
  emailjs
    .send(process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, {
      message,
      subject,
      to_email: toEmail,
    })
    .then(() => console.log("Email sent!"))
    .catch((error) => console.error("Error sending email:", error));
}

sendEmails();
