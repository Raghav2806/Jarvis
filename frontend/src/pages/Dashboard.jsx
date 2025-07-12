import { useLoaderData } from "react-router-dom";
import authLoader from "../util/authLoader.js";
import NavBar from "../components/commonComponents/NavBar.jsx";
import Wrapper from "../components/commonComponents/Wrapper.jsx";
function Dashboard() {
    const data = useLoaderData();
    console.log(data.stats);
    
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
    const userData=await authLoader();
    const response = await fetch(`http://localhost:3000/tran/data/${userData.user._id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    });
    if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Response(JSON.stringify({ message: data.message }), {
      status: response.status,
    });
  }
  const resData = await response.json();
  
  return resData;
}
