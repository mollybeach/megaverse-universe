import axios from 'axios';

//const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//const candidateId = process.env.REACT_APP_CANDIDATE_ID;
const BASE_URL = 'https://challenge.crossmint.io/api';
const candidateId = '7ba6732b-f85b-4e46-b23e-16dd0cc24777';

const fetchMap = async () => {
    try {
        const url = `${BASE_URL}/map/${candidateId}/goal`;
        console.log('Fetching goal map from:', url);
        const response = await axios.get(url);
        console.log('Goal Map:', response.data);
    } catch (error) {
        console.error('Error fetching goal map:', error);
        const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || 'Network Error' 
            : 'An unexpected error occurred';
        console.error('Error message:', errorMessage);
    }
};
console.log('candidateId', candidateId);
console.log('BASE_URL', BASE_URL);


// Call the fetchMap function to execute it
fetchMap();