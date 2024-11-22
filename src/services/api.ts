/*
* @title: API
* @path: src/services/api.ts
* @description: API service for interacting with the Megaverse endpoints
*/

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
const candidateId = process.env.REACT_APP_CANDIDATE_ID;


export const createPolyanet = async (row: number, column: number) => {
    try {
        const response = await axios.post(`${BASE_URL}/polyanets`, {
            candidateId,
            row,
            column,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating Polyanet:', error);
        throw error;
    }
};

export const deletePolyanet = async (row: number, column: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/polyanets`, {
            data: {
                candidateId,
                row,
                column,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting Polyanet:', error);
        throw error;
    }
};

export const fetchGoalMap = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/map/${candidateId}/goal`);
        return response.data;
    } catch (error) {
        console.error('Error fetching goal map:', error);
        throw error;
    }
};