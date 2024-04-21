const mongoose = require("mongoose")

const passengerSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, "title is required!"]
    },
    firstname: {
        type: String,
        required: [true, "firstname is required!"]
    },
    middlename: {
        type: String,
        required: [true, "middlename is required!"]
    },
    lastname: {
        type: String,
        required: [true, "lastname is required!"]
    },
    age: {
        type: Number,
        required: [true, "age is required!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required!"],
        match: [/^\d{10}$/, "Please fill a valid phone number"]
    }
},{
    timestamps: true
})

module.exports = mongoose.model("passengers", passengerSchema)