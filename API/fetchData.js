const axios = require("axios")
const asyncHandler = require("express-async-handler")
const dotenv = require("dotenv").config()
const searchFlight = require("../controller/flightController")

const api_key = process.env.FLIGHT_API_KEY
const api_secret = process.env.FLIGHT_API_SECRET
const auth_token = process.env.FLIGHT_AVAILABILITY_TOKEN

const api_url = "https://test.api.amadeus.com/v1/shopping/availability/flight-availabilities"
const fetchData = asyncHandler(async (fromCode, toCode, departure_date) => {
  const requestData = {
    originDestinations: [
      {
        id: "1",
        originLocationCode: fromCode,
        destinationLocationCode: toCode,
        departureDateTime: {
          date: departure_date,
          time: "21:15:00"
        }
      }
    ],
    travelers: [
      {
        id: "1",
        travelerType: "ADULT"
      }
    ],
    sources: [
      "GDS"
    ]
  };



const headers = {
  "X-API-KEY" : api_key,
  "X-API-SECRET" : api_secret,
  // "Authorization": `Bearer nwd7aUQ3pFKjhcG3AuQl3t6tWbhz`
  // "Authorization": `Bearer Gbua503Q1KW13cyuCVzaLXJZMxPR`,
  "Authorization": `Bearer ${auth_token}`
}

const response = await axios.post(api_url, requestData, { headers });
return response.data;

})


module.exports = fetchData