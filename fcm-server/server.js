// server.js (Node.js + Express)
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const PORT = 3000;

const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(express.json());

app.post('/send-notification', async (req, res) => {
  const {token, title, body, data} = req.body;

  const message = {
    token,
    notification: {
      title: title,
      body: body,
    },
    data: {
      ...data,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    res.json({success: true, response});
  } catch (error) {
    console.error('Send error:', error);
    res.status(500).json({success: false, error: error.message});
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FCM Server running at http://localhost:${PORT}`);
});
