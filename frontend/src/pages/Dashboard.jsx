import { useLoaderData } from "react-router-dom";
import authLoader from "../util/authLoader.js";
import NavBar from "../components/commonComponents/NavBar.jsx";
import Wrapper from "../components/commonComponents/Wrapper.jsx";
function Dashboard() {
    const data = useLoaderData();
    return (
        <>
            <NavBar user={data.user}/>
            <Wrapper title="Dashboard">
                <p>hello</p>
            </Wrapper>
        </>
        )
}
export default Dashboard;

export async function loader() {
    return await authLoader("/dashboard");
}