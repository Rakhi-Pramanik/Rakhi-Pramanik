const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userProfileSchema = mongoose.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    age: { type: String, require: true },
    address: { type: String, require: true },
    mobile: { type: String, require: true, unique: true },
    password: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    otp: { type: String},
    otpValid: { type: Date}
});

userProfileSchema.plugin(uniqueValidator);
module.exports = mongoose.model("UserProfile",userProfileSchema );