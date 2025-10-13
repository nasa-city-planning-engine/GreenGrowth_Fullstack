import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Routes'
import "./index.css"
import { CoordinatesProvider } from './others/coordinateProvider'
import { PolygonProvider } from "./others/polygonContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CoordinatesProvider>
      <PolygonProvider>
        <RouterProvider router={router} />
      </PolygonProvider>
    </CoordinatesProvider>
  </React.StrictMode>
);