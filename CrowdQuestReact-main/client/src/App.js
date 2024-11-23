import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Contributor from "./components/Contributor";
import Student from "./components/Student";
import SubExp from "./components/SubExp";
import ContriEditQuestion from "./components/ContriEditQuestion";
import Admin from "./components/Admin";
import Forget from "./components/Forget";

function App() {

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/contributor",
      element: <Contributor />
    },
    {
      path: "/student",
      element: <Student />
    },
    {
      path: "/subjectexpert",
      element: <SubExp />
    },
    {
      path: "/contributor/editQuestion",
      element: <ContriEditQuestion />
    },
    {
      path: "/admin",
      element: <Admin />
    },
    {
      path: "/forget",
      element: <Forget />
    },
    {
      path: "/*", 
      element: <Navigate to="/login" />
    }
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
