const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const homeSettingSchema = mongoose.Schema({
    bannerImg: { data: Buffer, contentType: String },
    title: { type: String, require: true },
    description: { type: String, require: true },
});

// userProfileSchema.plugin(uniqueValidator);
module.exports = mongoose.model("HomeSetting",homeSettingSchema );