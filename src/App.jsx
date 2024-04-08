import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/Error";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import Classes from "./pages/Classes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "classes", element: <Classes /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
