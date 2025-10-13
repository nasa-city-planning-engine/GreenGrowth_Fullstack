import { createBrowserRouter } from "react-router-dom";
import App from "../app";
import MapPage from "../pages/MapPage";
import ErrorPage from "../pages/ErrorPage";
import MainPage from "../pages/MainPage";
import Denuncias from "../components/DenunciaForm";
import ListaDenuncias from '../components/ListaDenuncias';
import EditPage from "../pages/EditPage";
import RegisterUser from "../components/RegisterUser";
import LoginUser from "../components/LoginUser";
import SimulationResults from "../components/SimulationResults";


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
        element: <EditPage />,
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
      }, 
      {
        path:"/dashboard", 
        element:<SimulationResults/>,
        errorElement: <ErrorPage/>
      }
        
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
