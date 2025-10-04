const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes")
const User = require("../models/userModel")
const express = require("express")
const router = express.Router()

router.post('/save-token', asyncHandler(async(req, res) => {

    const { userId, fcmToken } = req.body;

    await User.findByIdAndUpdate(userId, { fcmToken });

    res.status(StatusCodes.OK).json({ msg: "Token saved Successfully"})

}))


module.exports = router;