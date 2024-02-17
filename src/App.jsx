import { useState } from "react";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Layout from "./layout/Layout";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import Resetpasswordpage from "./pages/Resetpasswordpage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/login",
        element: <Loginpage />,
      },
      {
        path: "/register",
        element: <Registerpage />,
      },
      {
        path: "/resetpassword",
        element: <Resetpasswordpage />,
      },
      {
        path: "*",
        element: <h1>404</h1>,
      },
    ],
  },
]);

function App() {
  return (
    <>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
    </>
  );
}

export default App;
