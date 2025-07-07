import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import AuthenticationPage, {action as authAction} from './pages/Authentication';
import Dashboard from "./pages/Dashboard";
import { checkAuthToken, loaderToken } from './util/auth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: loaderToken,
    id: 'root',
    errorElement: <ErrorPage />,
    children: [
      { index: true, 
        element: <AuthenticationPage />,
        action: authAction,
      },
      { index: '/dashboard',
        element: <Dashboard />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
