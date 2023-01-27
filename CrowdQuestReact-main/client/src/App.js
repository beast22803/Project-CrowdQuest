import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
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
      path: "/Contributor",
      element: <Contributor />
    },
    {
      path: "/Student",
      element: <Student />
    },
    {
      path: "/SubjectExpert",
      element: <SubExp />
    },
    {
      path: "/Contributor/editQuestion",
      element: <ContriEditQuestion />
    },
    {
      path: "/Admin",
      element: <Admin />
    },
    {
      path: "/Forget",
      element: <Forget />
    }
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
