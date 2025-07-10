import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/commonPages/RootLayout";
import ErrorPage from "./pages/commonPages/ErrorPage";
import AuthenticationPage, {
  action as authAction,
} from "./pages/authPages/Authentication";
import Success from "./pages/authPages/Success";
import LandingPage from "./pages/commonPages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MethodDetails from "./pages/methodsPages/MethodDetails";
import PaymentForm, {
  action as pformAction,
} from "./pages/methodsPages/PaymentForm";
import EditMethod from "./pages/methodsPages/EditMethod";
import authLoader from "./util/authLoader";
import { loaderToken } from "./util/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: loaderToken,
    id: "root",
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "auth", element: <AuthenticationPage />, action: authAction },
      { path: "auth-success", element: <Success /> },
      { path: "dashboard", element: <Dashboard />, loader: authLoader },
      {
        path: "manage",
        children: [
          {
            index: true,
            element: <MethodDetails />,
            loader: authLoader,
          },
          {
            path: ":method",
            element: <PaymentForm />,
            loader: authLoader,
            action: pformAction,
          },
          {
            path: "edit/:id",
            element: <EditMethod/>
          }
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
