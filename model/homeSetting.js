const mongoose = require("mongoose");
const homeSettingSchema = mongoose.Schema({
   
   
    // image: { type: String, require: true },
    // title: { type: String, require: true },
    // description: { type: String, require: true },

    // seoTitle: { type: String, require: true },
    // seoDescription: { type: String, require: true}

    text_title: {
        type: Object, require: true
    },
    text_desc: {
        type: Object, require: true
    }
});

module.exports = mongoose.model("HomeSetting",homeSettingSchema );