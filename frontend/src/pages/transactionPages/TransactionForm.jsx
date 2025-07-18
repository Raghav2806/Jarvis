import {useLoaderData, redirect, useNavigation} from "react-router-dom"
import Wrapper from "../../components/commonComponents/Wrapper";
import AddTransaction from "../../components/transactionComponents/AddTransaction";
import NavBar from "../../components/commonComponents/NavBar"
import authLoader from "../../util/authLoader";
export default function TransactionForm(){
    const data=useLoaderData()
    const user=data.user
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
        <>
            <NavBar user={user}/>
            <Wrapper title={'Add Transaction'}>
                <AddTransaction user={user} isSubmitting={isSubmitting}/>
            </Wrapper>
        </>
    )
}

export async function action({request}) {
    const userData= await authLoader()
    const data= await request.formData();
    const transactionData = {
        userId: userData.user._id,
        title: data.get('title'),
        type: data.get('type'),
        frequency: data.get('frequency'),
        notes: data.get('notes'),
        currency: data.get('currency'),
        amount: data.get('amount'),
        date: data.get('date'),
        category: data.get('category'),
        method: data.get('method'),
        methodId: data.get('id'),
        lastDate: data.get('lastDate')
    }
    const response = await fetch("https://jarvis-qynk.onrender.com/tran/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
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
      return redirect("/dashboard");
}