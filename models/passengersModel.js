const mongoose = require("mongoose")

const passangerSchema = new mongoose.Schema({
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
    }
},{
    timestamps: true
})

module.exports = mongoose.model("passengers", passangerSchema)