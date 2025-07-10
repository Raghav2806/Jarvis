import EditForm from "../../components/methodsComponents/EditFom";
import authLoader from "../../util/authLoader";
import {useLoaderData} from 'react-router-dom'

export default function EditMethod(){
    const data=useLoaderData()
    return (
        <EditForm/>
    )
}

export async function loader({request, params}) {
    const id=params.id
    const userData=await authLoader();
    const response = await fetch(`http://localhost:3000/getmethod/${id}?email=${userData.user.email}`, {
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
  console.log(resData);
  
  return resData;
}