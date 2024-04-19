const axios = require("axios")
const asyncHandler = require("express-async-handler")
const dotenv = require("dotenv").config()
const searchFlight = require("../controller/flightController")
const refreshToken = require("../auth/refreshToken")

const api_key = process.env.FLIGHT_API_KEY
const api_secret = process.env.FLIGHT_API_SECRET
// const auth_token = process.env.FLIGHT_AVAILABILITY_TOKEN

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
  // "Authorization": `Bearer ${auth_token}`
  "Authorization": `Bearer ${process.env.FLIGHT_AVAILABILITY_TOKEN}`
}

// const response = await axios.post(api_url, requestData, { headers });
// return response.data;
try {
  const response = await axios.post(api_url, requestData, { headers });
  return response.data;
} catch (error) {
  if (error.response && error.response.status === 401) { // Token expired
      const newToken = await refreshToken(process.env.FLIGHT_AVAILABILITY_REFRESH_TOKEN, 'availability');
      headers.Authorization = `Bearer ${newToken}`;
      const response = await axios.post(api_url, requestData, { headers });
      return response.data;
  } else {
      throw error;
  }
}

})


module.exports = fetchData