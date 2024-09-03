import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL 

export const GET = async (url: string) => {
    try {
        const response = await axios.get(BASE_URL+url);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    };

export const POST = async (url: string, data: any) => {
    try {
        const response = await axios.post(BASE_URL+url, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }