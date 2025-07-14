import { useLoaderData, redirect } from "react-router-dom";
import authLoader from "../../util/authLoader.js";
import NavBar from "../../components/commonComponents/NavBar.jsx";
import CardTable from "../../components/methodsComponents/CardTable.jsx";
import BankTable from "../../components/methodsComponents/BankTable.jsx";
import UpiTable from "../../components/methodsComponents/UpiTable.jsx";
import Wrapper from "../../components/commonComponents/Wrapper.jsx";

export default function MethodDetails() {
  const data = useLoaderData();
  const user=data.user;
  return (
    <>
      <NavBar user={user} />
      <Wrapper title={'Manage Payment Methods'}>
      <CardTable cards={user.creditCards}/>
      <hr className="w-5/7 my-6 mx-auto border-t border-indigo-500" />
      <BankTable banks={user.bankAccounts}/>
      <hr className="w-5/7 my-6 mx-auto border-t border-indigo-500" />
      <UpiTable upis={user.upiIds}/>
      </Wrapper>
    </>
  );
}

export async function action({request}) {
  const userData = await authLoader();
    const data = await request.formData();
    const deleteData = {
      email: userData.user.email,
      id: data.get("id"),
    };
    console.log(deleteData);
    
    const response = await fetch("https://jarvis-qynk.onrender.com/deletemethod/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteData),
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
