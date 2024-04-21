const axios = require('axios');

const refreshToken = async (refreshToken, tokenType) => {
    const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.FLIGHT_API_KEY,
        client_secret: process.env.FLIGHT_API_SECRET,
        refresh_token: refreshToken
    });

    try {
        const response = await axios.post(tokenUrl, body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = response.data;
        // Update the environment variables 
        // process.env[tokenType === 'availability' ? 'FLIGHT_AVAILABILITY_TOKEN' : 'FLIGHT_IATA_TOKEN'] = access_token;
        // process.env[tokenType === 'availability' ? 'FLIGHT_AVAILABILITY_REFRESH_TOKEN' : 'FLIGHT_IATA_REFRESH_TOKEN'] = refresh_token;

        process.env[
            tokenType === 'availability'
              ? 'FLIGHT_AVAILABILITY_TOKEN'
              : tokenType === 'airline'
              ? 'FLIGHT_AIRLINE_TOKEN'
              : 'FLIGHT_IATA_TOKEN'
          ] = access_token;
          
          process.env[
            tokenType === 'availability'
              ? 'FLIGHT_AVAILABILITY_REFRESH_TOKEN'
              : tokenType === 'airline'
              ? 'FLIGHT_AIRLINE_REFRESH_TOKEN'
              : 'FLIGHT_IATA_REFRESH_TOKEN'
          ] = refresh_token;
          

        return access_token;
    } catch (error) {
        console.error('Error refreshing token:', error.response.data);
        throw new Error('Failed to refresh token');
    }
};


module.exports = refreshToken