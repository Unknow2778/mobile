import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const GET = async (url: string) => {
    try {
        const lang = await AsyncStorage.getItem('lang') || 'en';
        const response = await axios.get(BASE_URL + url, {
            params: {
                lang: lang
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const POST = async (url: string, data: any) => {
    try {
        const response = await axios.post(BASE_URL + url, data);
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { 
                success: false, 
                error: error.response.data.message || error.response.data || 'An error occurred'
            };
        } else {
            return { success: false, error: 'An unexpected error occurred' };
        }
    }
};