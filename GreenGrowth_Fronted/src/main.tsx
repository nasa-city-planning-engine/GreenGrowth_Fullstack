import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Routes'
import "./index.css"
import { CoordinatesProvider } from './coordinateProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CoordinatesProvider>
    <RouterProvider router={router} />
    </CoordinatesProvider>
  </React.StrictMode>
);