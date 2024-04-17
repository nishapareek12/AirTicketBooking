const mongoose  = require("mongoose")

const flightSchema = new mongoose.Schema({
    from: {
        type: String,
        required: [true, "please enter the place"]
    },
    to: {
        type: String,
        required: [true, "please enter destination"]
    }
},{
    timestamps: true
})

module.exports = mongoose.model("flightModel", flightSchema)