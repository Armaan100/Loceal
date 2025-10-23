// src/utils/geocoding.js
const axios = require('axios');

/**
 * Convert address details to GeoJSON coordinates (longitude, latitude) 
 * using the Nominatim (OpenStreetMap) API.
 * * @param {object} addressDetails - The structured address object 
 * (e.g., { street, city, state, pincode, country })
 * @returns {object} { coordinates: { longitude, latitude }, address: structured_address }
 */
const getCoordinatesFromAddress = async (addressDetails) => {
    // 1. Construct the full query string
    const fullAddress = `${addressDetails.street}, ${addressDetails.city}, ${addressDetails.state}, ${addressDetails.pincode}, ${addressDetails.country || 'India'}`;
    
    // 2. Prepare the API request URL
    const url = 'https://nominatim.openstreetmap.org/search';
    
    try {
        const response = await axios.get(url, {
            params: {
                q: fullAddress, // The full address query string
                format: 'json', // Request JSON output
                limit: 1, // Only need the best result
                addressdetails: 1, // Include a detailed address breakdown
                // IMPORTANT for API Policy compliance: Identify your application
                'user-agent': 'LocalMarketplace-Project-Demo/1.0' 
            }
        });

        const data = response.data;

        if (!data || data.length === 0) {
            throw new Error(`Geocoding failed for address: ${fullAddress}. No results found.`);
        }

        // 3. Extract necessary data from the best result
        const result = data[0];
        
        const longitude = parseFloat(result.lon);
        const latitude = parseFloat(result.lat);

        // 4. Return the structured result
        return {
            coordinates: { longitude, latitude },
            address: {
                street: result.address.road || addressDetails.street, // Use API's parsed road if available
                city: result.address.city || result.address.town || addressDetails.city,
                state: result.address.state || addressDetails.state,
                pincode: result.address.postcode || addressDetails.pincode,
                country: result.address.country || addressDetails.country || 'India',
                // Landmark is often not reliably returned, use original if available
                landmark: addressDetails.landmark || null 
            }
        };

    } catch (error) {
        console.error('Geocoding API Error:', error.message);
        // Throw an error that the controller can catch
        throw new Error("Could not convert address to coordinates. Please check the address details.");
    }
};

module.exports = { getCoordinatesFromAddress };