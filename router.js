const express = require("express");
const router = new express.Router();
const axios = require("axios");

const authKey = "YOUR_AUTH_KEY";
const senderId = "YOUR_SENDER_ID";

const sendSMS = async (phoneNumber, msg) => {
  const url = `https://restapi.smscountry.com/v0.1/Accounts/${authKey}/SMSes/`;

  const options = {
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Apikey ${authKey}`,
    },
    json: {
      from: senderId,
      to: phoneNumber,
      text: msg,
    },
  };

  try {
    const response = await axios.post(url, options.data, {
      headers: options.headers,
    });
    console.log("SMS Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};

const sendOTP = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("otp", otp);

    const message = `Your OTP is ${otp}. Please do not share it with anyone.`;

    await sendSMS(phoneNumber, message);

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
