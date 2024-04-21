// const asynchandler = require("express-async-handler")
// const passengers = require("../models/passengersModel")
// const searchFlight = require("../controller/flightController")
// const addPassengers = asynchandler(async (req,res) => {
//     const {title, firstname, middlename, lastname,age, email, phone} = req.body;
//     if(!title || !firstname || !middlename || !lastname || !age || !email || !phone){
//         throw new Error("enter mandatory details")
//     }else{
//         const passenger = await  passengers.create({
//             title,
//             firstname,
//             middlename,
//             lastname,
//             age,
//             email,
//             phone
//         })
//         if(passenger){
//             res.status(201).json({
//                 status: 1,
//                 message: "passenger added",
//                 data: passenger
//             })
//         }else{
//             res.status(400)
//             throw new Error("unable to add passenger")
//         }
//     }
// })

// module.exports = addPassengers




const asyncHandler = require("express-async-handler");
const Passengers = require("../models/passengersModel");

const addPassengers = asyncHandler(async (req, res) => {
    const passengersData = req.body; // Expecting passengers to be an array of objects
    // console.log(passengersData)
    if (!passengersData || passengersData.length === 0) {
        res.status(400);
        throw new Error("No passenger data provided");
    }

    const errors = [];
    const createdPassengers = [];

    for (const passengerInfo of passengersData) {
        const { title, firstname, middlename, lastname, age, email, phone } = passengerInfo;

        // Check if all mandatory details are present
        if (!title || !firstname || !middlename || !lastname || !age || !email || !phone) {
            errors.push(`Missing mandatory details for passenger ${firstname} ${lastname}`);
            continue; // Skip this passenger and go to the next one
        }

        try {
            const passenger = await Passengers.create({
                title,
                firstname,
                middlename,
                lastname,
                age,
                email,
                phone
            });
            createdPassengers.push(passenger);
        } catch (error) {
            errors.push(`Error creating passenger ${firstname} ${lastname}: ${error.message}`);
        }
    }

    if (createdPassengers.length > 0) {
        res.status(201).json({
            status: 1,
            message: `${createdPassengers.length} passengers added successfully.`,
            data: createdPassengers
        });
    } else {
        res.status(400).json({
            status: 0,
            message: "Unable to add any passengers",
            errors: errors
        });
    }
});

module.exports = addPassengers;
