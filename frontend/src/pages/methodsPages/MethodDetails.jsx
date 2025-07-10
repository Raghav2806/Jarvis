import { useLoaderData, Link } from "react-router-dom";
import authLoader from "../../util/authLoader.js";
import NavBar from "../../components/commonComponents/NavBar.jsx";

export default function MethodDetails() {
  const data = useLoaderData();
  return (
    <>
      <NavBar user={data.user} />
      <div className="flex justify-center gap-3 mx-auto">
        <Link
          className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          to={"card"}
        >
          Card
        </Link>
        <Link
          className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          to={"bank"}
        >
          Bank
        </Link>
        <Link
          className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          to={"upi"}
        >
          UPI
        </Link>
      </div>
    </>
  );
}

export async function loader() {
  return await authLoader("/dashboard");
}
