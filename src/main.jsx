import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from './Pages/Home/Home.jsx';
import MainLayout from './Layout/MainLayout.jsx';
import Arbitrage from './Pages/Arbitrage/Arbitrage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/arbitrage',
        element: <Arbitrage/>
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
