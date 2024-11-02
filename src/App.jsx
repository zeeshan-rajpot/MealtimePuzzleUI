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
import InterventionPyramid from "./pages/Assessments/InterventionPyramid";
import Settings from "./pages/Settings/Settings";
import ChildInformationPage from "./pages/Home/ChildInformationPage";
import DetailPage from "./pages/Home/DetailPage";
import ChildData from "./pages/Formulation/ChildData";
import Formulation from "./pages/Formulation/Formulation";
import FormulationPyrmaid from "./pages/Home/FormulationPyrmaid";
import HistoryDetail from "./pages/History/HistoryDetail";
import Buttunpage from "./pages/Assessments/Buttunpage";
import InterventionPyramidupdate from "./pages/Assessments/InterventionPyramidupdate";
import Addnewassestent from "./pages/Assessments/Addnewassestent";
import GenerateReport from "./pages/Assessments/GenerateReport";

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
      path: "/home/options/:urn/:childName",
      element: <Pyramid />,
    }, 
    
    {
      path: "/home/addnew/:urn/:childName/:totalSessions",
      element: <Addnewassestent />,
    },
    {
      path: "/home/childinfo",
      element: <ChildInformationPage />,
    },
    {
      path: "/home/detailpage/:urn/:session",
      element: <DetailPage />,
    },
    {
      path: "/history",
      element: <History />,
    },
    {
      path: "/history/DetailPage/:urn",
      element: <HistoryDetail />,
    },
    {
      path: "/Profile",
      element: <Profile />,
    }, 
     {
      path: "/Buttunpage/:urn/:childName",
      element: <Buttunpage />,
    },
    {
      path: "/home/generatereport/:urn/:childName",
      element: <GenerateReport />,
    },
    {
      path: "/intervention",
      element: <Assessments />,
    },
    {
      path: "/intervention/pyramid/:urn",
      element: <InterventionPyramid />,
    },
    
    {
      path: "/interventionupdate/pyramid/:urn/:session/:childName",
      element: <InterventionPyramidupdate />,
    },
    
    {
      path: "/childData",
      element: <ChildData />,
    },
    {
      path: "/childData/formulation/:urn",
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
