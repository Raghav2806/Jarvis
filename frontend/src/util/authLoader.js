import getAuthToken from "./auth";
import { redirect } from "react-router-dom";

export default async function authLoader() {
    const token = getAuthToken();
    if(!token) {
        return redirect('/');
    }

    const response = await fetch('http://localhost:3000/dashboard', {
    headers: {
    Authorization: `Bearer ${token}`
    }
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Response(JSON.stringify({ message: data.message }), {
            status: response.status
        });
    }
    const data = await response.json();
    return data;
}