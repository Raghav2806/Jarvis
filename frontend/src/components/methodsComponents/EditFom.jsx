import { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import Dropdown from "../commonComponents/Dropdown";

export default function EditForm({data}){
    const options = ["Netbanking", "Cheque", "ECS", "NEFT/RTGS/IMPS", "Other"];
    const details=data.detail;
    const [selected, setSelected]=useState('');
    const [formData, setFormData] = useState({
        name: "",
        lastFour: "",
        bankName: "",
        upi: "",
        provider: "",
        accountType: "",
    })
    const method=data.method;
    function formatTitle(method) {
        if (method == "upi") return "UPI";
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
    useEffect(() => {
    if (details) {
      setFormData({
        name: details.name || "",
        lastFour: details.lastFour || "",
        bankName: details.bankName || "",
        upi: details.upi || "",
        provider: details.provider || "",
        accountType: details.accountType || "",
      });
      setSelected(details.bankMethod)
    }
  }, [details]);
    function handleChange(e) {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }
    return(
       <>
             <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
               <div className="mx-auto max-w-2xl text-center">
                 <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
                   Update {formatTitle(method)}
                 </h2>
               </div>
               <Form
                 action="#"
                 method="POST"
                 className="mx-auto mt-16 max-w-xl sm:mt-20"
               >
                 <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                   <div>
                     <label className="block text-sm/6 font-semibold text-gray-900">
                       {method == "bank" ? "Method" : formatTitle(method)} Name
                     </label>
                     {method == "bank" ? (
                       <Dropdown options={options} selected={selected} setSelected={setSelected}/>
                     ) : (
                       <div className="mt-2.5">
                         <input
                           name="name"
                           type="text"
                           value={formData.name}
                           onChange={handleChange}
                           placeholder={method == "card" ? "HDFC Regalia" : "GPay"}
                           className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                         />
                       </div>
                     )}
                   </div>
                   <div>
                     <label className="block text-sm/6 font-semibold text-gray-900">
                       {method == "card"
                         ? "Last Four Digits"
                         : method == "bank"
                         ? "Bank Name"
                         : "UPI ID"}
                     </label>
                     <div className="mt-2.5">
                       <input
                         name={
                           method == "card"
                             ? "lastFour"
                             : method == "bank"
                             ? "bankName"
                             : "upi"
                         }
                         value={
                           method == "card"
                             ? `${formData.lastFour}`
                             : method == "bank"
                             ? `${formData.bankName}`
                             : `${formData.upi}`
                         }
                         onChange={handleChange}
                         type="text"
                         placeholder={
                           method == "card"
                             ? "XXXX"
                             : method == "bank"
                             ? "ICICI Bank"
                             : "yourname@okhdfcbank"
                         }
                         className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                       />
                     </div>
                   </div>
                   {method == "upi" ? (
                     <></>
                   ) : (
                     <div className="sm:col-span-2">
                       <label className="block text-sm/6 font-semibold text-gray-900">
                         {method == "card"
                           ? "Provider"
                           : method == "bank"
                           ? "Account Type"
                           : ""}
                       </label>
                       <div className="mt-2.5">
                         <input
                           name={method == "card" ? "provider" : "accountType"}
                           value={method == "card" ? `${formData.provider}` : `${formData.accountType}`}
                           onChange={handleChange}
                           type="text"
                           placeholder={
                             method == "card"
                               ? "Mastercard"
                               : method == "bank"
                               ? "Savings"
                               : ""
                           }
                           className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                         />
                       </div>
                       <input hidden={true} value={method} onChange={()=>{}} name="method"/>
                       <input hidden={true} value={details._id} onChange={()=>{}} name="id"/>
                     </div>
                   )}
                 </div>
                 <div className="mt-10">
                   <button
                     className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                     type="submit"
                   >
                     Update {formatTitle(method)}
                   </button>
                 </div>
               </Form>
             </div>
           </> 
    )
}