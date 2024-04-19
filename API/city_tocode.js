const axios = require("axios")
const asyncHandler = require("express-async-handler")
const dotenv = require("dotenv").config()

const api_key = process.env.FLIGHT_API_KEY
const api_secret = process.env.FLIGHT_API_SECRET
const base_api_url = process.env.BASE_API_URL
const auth_token = process.env.FLIGHT_IATA_TOKEN

const IATAcode = asyncHandler(async (city) => {
    try{
        // const city = this.city;
        const api_url = `${base_api_url}?subType=CITY&keyword=${city}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL`
        const headers = {
            "X-API-KEY" : api_key,
            "X-API-SECRET" : api_secret,
            "Authorization": `Bearer ${auth_token}`,
            "content-type": "application/x-www-form-urlencoded"
        }
              
          const response = await axios.get(api_url,{ headers })
        //   console.log("response:  " ,response)
          const iata_code = response.data.data[0].iataCode
          return iata_code
          
    }catch(err){
       console.log("code-api error",err)
    }
    
})

module.exports = IATAcode