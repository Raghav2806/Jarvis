import EditForm from "../../components/methodsComponents/EditFom";
import authLoader from "../../util/authLoader";
import {useLoaderData, redirect, useNavigation} from 'react-router-dom'

export default function EditMethod(){
    const data=useLoaderData()
    const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
    return (
        <EditForm data={data} isSubmitting={isSubmitting}/>
    )
}

export async function loader({params}) {
    const id=params.id
    const userData=await authLoader();
    const response = await fetch(`https://jarvis-qynk.onrender.com/getmethod/${id}?email=${userData.user.email}`, {
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

export async function action({request}) {
  const userData = await authLoader();
  const data = await request.formData();
  const updatedData = {
    email: userData.user.email,
    id: data.get('id'),
    method: data.get('method'),
    name: data.get("name"),
    lastFour: data.get("lastFour"),
    bankMethod: data.get("bankMethod"),
    bankName: data.get("bankName"),
    upi: data.get("upi"),
    provider: data.get("provider"),
    accountType: data.get("accountType"),
  }
  
  const response = await fetch("https://jarvis-qynk.onrender.com/editmethod", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
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
  return redirect("/manage");
}