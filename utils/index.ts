import { BASE_URL } from "./path";
import axios from 'axios';
export const sendVerificationCode = async (
    callback: (code: string) => void,
    username: string,
    type: string
) => {
    const code = Math.floor(Math.random() * 1000000);
    callback(code.toString());
    const verifyUsername = username;
    if (type === 'phone') {
        const content = {
            phone: verifyUsername,
            code: code.toString(),
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/phone`,
            content
        );
        return data;
    }
    else {
        const content = {
            email: verifyUsername,
            code: code.toString(),
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/auth/verify/email`,
            content
        );
        return data;
    }
};