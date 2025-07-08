import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import AuthenticationPage, {action as authAction} from './pages/Authentication';
import Dashboard, {loader as dashLoader} from "./pages/Dashboard";
import { loaderToken } from './util/auth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: loaderToken,
    id: 'root',
    errorElement: <ErrorPage />,
    children: [
      { path:'auth',
        element: <AuthenticationPage />,
        action: authAction,
      },
      { path: 'dashboard',
        element: <Dashboard />,
        loader: dashLoader,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
