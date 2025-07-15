import { useLoaderData, redirect, useNavigation } from "react-router-dom";
import NavBar from "../../components/commonComponents/NavBar.jsx";
import authLoader from "../../util/authLoader.js";
import MethodForm from "../../components/methodsComponents/MethodForm.jsx";

export default function PaymentForm() {
  const data = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <>
      <NavBar user={data.user}/>
      <MethodForm isSubmitting={isSubmitting}/>
    </>
  );
}


export async function action({ request, params }) {
  const method = params.method;
  if (method !== "card" && method !== "bank" && method !== "upi") {
    throw new Response(JSON.stringify({ message: "Unsupported method" }), {
      status: 422,
    });
  }
  const userData = await authLoader();
  const data = await request.formData();
  const methodData = {
    email: userData.user.email,
    name: data.get("name"),
    lastFour: data.get("lastFour"),
    bankMethod: data.get("bankMethod"),
    bankName: data.get("bankName"),
    upi: data.get("upi"),
    provider: data.get("provider"),
    accountType: data.get("accountType"),
  };
  
  const response = await fetch("https://jarvis-qynk.onrender.com/addmethod/" + method, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(methodData),
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
