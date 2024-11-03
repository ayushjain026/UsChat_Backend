const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { db } =  require("../config/firebase");
const COMMON_VALIDATION = require("../enum/validationMsgEnums");


exports.protect = asyncHandler(async(req, res, next) => {
    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")) {
        try {
            const accessToken = req.headers.authorization.split(" ")[1];

            // decode token id.
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            const user = db.collection("Users").doc(decoded.userId);
            const userSnapshot = await user.get();
            if (userSnapshot.exists) {
                const user = userSnapshot.data();
                console.log(user);
                next();
            }
        } catch(error) {
            throw new Error(COMMON_VALIDATION.COMMON_ERROR);
        }
    }
});
