import { useLoaderData, Link } from "react-router-dom";
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
      <hr className="w-7/8 my-6 mx-auto border-t-2 border-indigo-500" />
      <BankTable banks={user.bankAccounts}/>
      <hr className="w-7/8 my-6 mx-auto border-t-2 border-indigo-500" />
      <UpiTable upis={user.upiIds}/>
      </Wrapper>
    </>
  );
}

export async function loader() {
  return await authLoader("/dashboard");
}
