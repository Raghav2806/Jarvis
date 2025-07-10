import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/commonPages/RootLayout";
import ErrorPage from "./pages/commonPages/ErrorPage";
import AuthenticationPage, {
  action as authAction,
} from "./pages/authPages/Authentication";
import Success from "./pages/authPages/Success";
import LandingPage from "./pages/commonPages/LandingPage";
import Dashboard, { loader as dashLoader } from "./pages/Dashboard";
import MethodDetails, {
  loader as methodLoader,
} from "./pages/methodsPages/MethodDetails";
import PaymentForm, {
  action as pformAction,
  loader as pformLoader,
} from "./pages/methodsPages/PaymentForm";
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
      { path: "dashboard", element: <Dashboard />, loader: dashLoader },
      {
        path: "manage",
        children: [
          {
            index: true,
            element: <MethodDetails />,
            loader: methodLoader,
          },
          {
            path: ":method",
            element: <PaymentForm />,
            loader: pformLoader,
            action: pformAction,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
