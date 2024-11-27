import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const candidateId = process.env.NEXT_PUBLIC_CANDIDATE_ID;

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

/*

function alignCurrentMapToGoal(currentMap: string[][], goalMap: string[][]): string[][] {
    // Create a new map to hold the aligned values
    const alignedMap = currentMap.map(row => [...row]); // Deep copy of currentMap

    // Iterate through the goal map
    for (let i = 0; i < goalMap.length; i++) {
        for (let j = 0; j < goalMap[i].length; j++) {
            // If the goal map has a POLYANET
            if (goalMap[i][j] === "POLYANET") {
                // Find a POLYANET in the current map
                for (let x = 0; x < currentMap.length; x++) {
                    for (let y = 0; y < currentMap[x].length; y++) {
                        if (currentMap[x][y] === "POLYANET") {
                            // Move POLYANET to the goal position
                            alignedMap[i][j] = "POLYANET";
                            alignedMap[x][y] = "SPACE"; // Set original position to SPACE
                            break; // Exit the inner loop after moving
                        }
                    }
                    // If we found and moved a POLYANET, break the outer loop
                    if (alignedMap[i][j] === "POLYANET") {
                        break;
                    }
                }
            }
        }
    }

    return alignedMap;
}
*/