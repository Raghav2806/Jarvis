import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import AuthenticationPage, {action as authAction} from './pages/Authentication';
import Success from "./pages/Success";
import LandingPage from "./pages/LandingPage";
import Dashboard, {loader as dashLoader} from "./pages/Dashboard";
import MethodDetails, {loader as methodLoader} from "./pages/MethodDetails";
import PaymentForm, {action as pformAction, loader as pformLoader} from "./pages/PaymentForm";
import { loaderToken } from './util/auth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: loaderToken,
    id: 'root',
    errorElement: <ErrorPage />,
    children: [
      { index: true,
        element: <LandingPage />
      },
      { path:'auth',
        element: <AuthenticationPage />,
        action: authAction,
      },
      { path: 'auth-success',
        element: <Success/>
      },
      { path: 'dashboard',
        element: <Dashboard />,
        loader: dashLoader,
      },
      {
        path: 'manage',
        children: [
          {
            index:true,
            element: <MethodDetails/>,
            loader: methodLoader,
          },
          {
            path: ':method',
            element: <PaymentForm/>,
            loader: pformLoader,
            action: pformAction,
            
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
