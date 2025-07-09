import { useLoaderData } from "react-router-dom";
import { redirect } from "react-router-dom";
import getAuthToken from "../util/auth.js"
import NavBar from "../components/NavBar.jsx";
function Dashboard() {
    const data = useLoaderData();
    return (
        <>
            <NavBar user={data.user}/>
            <div className="py-10">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{/* Your content */}</div>
                </main>
            </div>
        </>
        )
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
    
    if (!response.ok) {
        const data = await response.json();
        throw new Response(JSON.stringify({ message: data.message }), {
            status: response.status
        });
    }
    const data = await response.json();
    return data;
}