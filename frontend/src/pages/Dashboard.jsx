import { useLoaderData } from "react-router-dom";
import { redirect } from "react-router-dom";
import getAuthToken from "../util/auth.js"
import Board from "../components/Board.jsx";
function Dashboard() {
    const data = useLoaderData();
    return <Board/>
}
export default Dashboard;

export async function loader() {
    const token = getAuthToken();
    if(!token) {
        return redirect('/');
    }

    const response = await fetch('http://localhost:3000/dashboard', {
    headers: {
    Authorization: `Bearer ${token}`
    }
    });
    console.log(response);
    
    if (!response.ok) {
      throw new Response('Unauthorized', { status: 401 });
    }
    const data = await response.json();
    return data;
}