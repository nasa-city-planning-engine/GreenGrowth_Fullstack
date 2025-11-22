import { createBrowserRouter } from "react-router-dom";
import App from "../app";
import MapPage from "../pages/MapPage";
import ErrorPage from "../pages/ErrorPage";
import MainPage from "../pages/MainPage";
import Denuncias from "../components/reports/DenunciaForm";
import ListaDenuncias from '../components/reports/ListaDenuncias';
import EditPage from "../pages/EditPage";
import RegisterUser from "../components/auth/RegisterUser";
import LoginUser from "../components/auth/LoginUser";
import { FormParametersProvider, PolygonsProvider, ZoneProvider } from "../others/simulationProvider";


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
        element: (
        <FormParametersProvider>
          <PolygonsProvider>
            <ZoneProvider>
              <EditPage />
            </ZoneProvider>
          </PolygonsProvider>
        </FormParametersProvider>
      ),
        errorElement: <ErrorPage />,
      },
      {
        path:"/report",
        element:<Denuncias />,
        errorElement:<ErrorPage />
      },
      {
        path:"/reportList",
        element:<ListaDenuncias />,
        errorElement:<ErrorPage />
      }, {
        path:"/register", 
        element:<RegisterUser/>,
        errorElement: <ErrorPage/>
      }, {
        path:"/login", 
        element:<LoginUser/>,
        errorElement: <ErrorPage/>
      }
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
