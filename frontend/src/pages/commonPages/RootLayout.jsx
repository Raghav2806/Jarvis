import { Outlet } from "react-router-dom"

export default function RootLayout  ()  {
  // const navigation = useNavigation();
  return (
    <>
    <main>
    {/* {navigation.state === "loading" && <p>Loading...</p>} */}
        <Outlet/>
    </main>
    </>
  )
}
