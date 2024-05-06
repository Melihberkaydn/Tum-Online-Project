import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/Error";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import Classes from "./pages/Classes";
import UserClasses, {
  loader as userClassLoader,
} from "./pages/UserClasses.jsx";
import { Provider } from "react-redux";
import store from "./store/index";
import AuthenticationPage, {
  action as authAction,
} from "./pages/Authentication.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "All-classes", element: <Classes /> },
      {
        path: "auth",
        element: <AuthenticationPage />,
        action: authAction,
      },
      {
        path: "enrolledClasses",
        element: <UserClasses />,
        loader: userClassLoader,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
