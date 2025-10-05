import { createBrowserRouter } from "react-router-dom";
import App from "../app";
import MapPage from "../pages/MapPage";
import ErrorPage from "../pages/ErrorPage";
import MainPage from "../pages/MainPage";
import EditMapPage from "../pages/EditMapPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/map",
        element: <MapPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/edit",
        element: <EditMapPage />,
        errorElement: <ErrorPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
