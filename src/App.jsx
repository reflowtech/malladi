import { useState } from "react";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout";
import Registerpage from "./pages/Registerpage";
import Resetpasswordpage from "./pages/Resetpasswordpage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/register",
        element: <Registerpage />,
      },
      {
        path: "/resetpassword",
        element: <Resetpasswordpage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
