import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/commonPages/RootLayout";
import ErrorPage from "./pages/commonPages/ErrorPage";
import AuthenticationPage, {
  action as authAction,
} from "./pages/authPages/Authentication";
import Success from "./pages/authPages/Success";
import LandingPage from "./pages/commonPages/LandingPage";
import Dashboard, {loader as dashLoader} from "./pages/Dashboard";
import MethodDetails, {action as deleteAction} from "./pages/methodsPages/MethodDetails";
import PaymentForm, {
  action as pformAction,
} from "./pages/methodsPages/PaymentForm";
import EditMethod, {
  loader as eFormLoader,
  action as eFormAction
} from "./pages/methodsPages/EditMethod";
import authLoader from "./util/authLoader";
import { loaderToken } from "./util/auth";
import TransactionForm, {action as addTranAction} from "./pages/transactionPages/TransactionForm";

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
            loader: authLoader,
            action: deleteAction
          },
          {
            path: ":method",
            element: <PaymentForm />,
            loader: authLoader,
            action: pformAction,
          },
          {
            path: "edit/:id",
            element: <EditMethod/>,
            loader: eFormLoader,
            action: eFormAction
          }
        ],
      },
      {
        path: "transactions",
        children: [
          {
            index: true,
            element: <TransactionForm/>,
            loader: authLoader,
            action: addTranAction
          }
        ]
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
