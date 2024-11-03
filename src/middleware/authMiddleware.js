const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { doc, getDoc } = require("firebase/firestore");

const { db } =  require("../config/firebase");
const COMMON_VALIDATION = require("../enum/validationMsgEnums");
const User = require("../models/userModel");


exports.protect = asyncHandler(async(req, res, next) => {
    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")) {
        try {
            const accessToken = req.headers.authorization.split(" ")[1];

            // decode token id.
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            const userRef = doc(db, "Users", decoded.userId);
            const userDetails = await getDoc(userRef);
            if (userDetails.exists) {
                const { password, ...user } = userDetails.data();
                user.id = userDetails.id;
                req.user=user;
                console.log(user);
                next();
            }
        } catch(error) {
            throw new Error(COMMON_VALIDATION.COMMON_ERROR);
        }
    }
});
