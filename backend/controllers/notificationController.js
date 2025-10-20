const admin = require('../config/firebase');
const { BadRequestError } = require('../errors');
const User = require("../models/userModel")
const asyncHandler = require('express-async-handler')
const { StatusCodes } = require('http-status-codes')

const sendNotification = asyncHandler(async (req, res) => {
    const { userId, title, body } = req.body;
  
    if (!userId || !title || !body) {
      throw new BadRequestError("userId, title and body are required");
    }
  
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      throw new BadRequestError("User not found or missing FCM token");
    }
  
    const message = {
      notification: { title, body },
      token: user.fcmToken,
    };
  
    const response = await admin.messaging().send(message);
  
    return res
      .status(StatusCodes.OK)
      .json({ response, msg: "Notification Sent Successfully"});
  });


module.exports = { sendNotification }