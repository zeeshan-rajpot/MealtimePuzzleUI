import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home/Home";
import Pyramid from "./pages/Home/Pyramid";
import History from "./pages/History/History";
import Profile from "./pages/Profile/Profile";
import Assessments from "./pages/Assessments/Assessments";
import Settings from "./pages/Settings/Settings";
import StepperForm from "./pages/Home/StepperForm";
import ChildInformationPage from "./pages/Home/ChildInformationPage";
import DetailPage from "./pages/Home/DetailPage";
import ChildData from "./pages/Formulation/ChildData";
import Formulation from "./pages/Formulation/Formulation";
import FormDetailPage from "./pages/Assessments/FormDetailPage";
import FormulationPyrmaid from "./pages/Home/FormulationPyrmaid";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/home/formulationOptions/:urn",
      element: <FormulationPyrmaid />,
    },
    {
      path: "/home/options",
      element: <Pyramid />,
    },
    {
      path: "/home/childinfo",
      element: <ChildInformationPage />,
    },
    {
      path: "/home/stepper",
      element: <StepperForm />,
    },
    {
      path: "/home/detailpage",
      element: <DetailPage />,
    },
    {
      path: "/history",
      element: <History />,
    },
    {
      path: "/Profile",
      element: <Profile />,
    },
    {
      path: "/intervention",
      element: <Assessments />,
    },
    {
      path: "/intervention/detailpage",
      element: <FormDetailPage />,
    },
    {
      path: "/childData",
      element: <ChildData />,
    },
    {
      path: "/childData/formulation",
      element: <Formulation />,
    },

    {
      path: "/settings",
      element: <Settings />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
