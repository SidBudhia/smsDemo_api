const express = require("express");
const router = new express.Router();
const axios = require("axios");

const authKey = process.env.AUTHKEY;
const authToken = process.env.AUTHTOKEN;
const senderId = process.env.SENDERID;

// console.log("authKey:", authKey);
// console.log("authToken:", authToken);

const authString = `${authKey}:${authToken}`;

const base64AuthString = Buffer.from(authString).toString("base64");
// console.log(base64AuthString);

const sendSMS = async (phoneNumber, msg) => {
  const url = `https://restapi.smscountry.com/v0.1/Accounts/${authKey}/SMSes/`;

  const data = {
    SenderId: senderId,
    Number: phoneNumber,
    Text: msg,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64AuthString}`,
      },
    });
    console.log("SMS Sent:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error sending SMS. API response:", error.response.data);
    } else if (error.request) {
      console.error("Error sending SMS. No response received.");
    } else {
      console.error("Error sending SMS:", error.message);
    }
    throw error;
  }
};

const sendOTP = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("otp", otp);

    const message = `User Admin login OTP is${otp} - SMSCOU`;

    const result = await sendSMS(phoneNumber, message);

    console.log("sms result", result);

    res.status(200).json({
      message: "OTP sent successfully.",
      otp,
    });
  } catch (err) {
    console.error("Error sending SMS:", err);
    res.status(500).json({ message: "Failed to send SMS." });
  }
};

router.post("/user/sms", sendOTP);

module.exports = router;
