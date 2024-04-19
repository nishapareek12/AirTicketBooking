const asynchandler = require("express-async-handler")
const passangers = require("../models/passengersModel")
const searchFlight = require("../controller/flightController")
const addPassengers = asynchandler(async (req,res) => {
    const {title, firstname, middlename, lastname,age, email, phone} = req.body;
    if(!title || !firstname || !middlename || !lastname || !age || !email || !phone){
        throw new Error("enter mandatory details")
    }else{
        const passanger = await  passangers.create({
            title,
            firstname,
            middlename,
            lastname,
            age,
            email,
            phone
        })
        if(passanger){
            res.status(201).json({
                status: 1,
                message: "passanger added",
                data: passanger
            })
        }else{
            res.status(400)
            throw new Error("unable to add passanger")
        }
    }
})

module.exports = addPassengers