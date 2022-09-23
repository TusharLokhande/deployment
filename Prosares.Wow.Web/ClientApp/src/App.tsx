import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { LoaderContext } from "./Helpers/Context/Context";
import Loader from "./Helpers/Loader/Loader";
import Router from "./Routes/Routes";

//  import TaskList from './TaskList/TaskList';
// import MonthlyTracker from './MonthlyTracker/MonthlyTracker';
//import NewTask from './NewTask/NewTask';
//import NewTicket from './NewTicket/NewTicket';

function App() {
  const [loader, setLoader] = useState<boolean>(false);
  const showLoader = () => setLoader(true);
  const hideLoader = () => setLoader(false);

  return (
    <>
      <LoaderContext.Provider value={{ showLoader, hideLoader }}>
        <Router />
        <ToastContainer
          position="top-center"
          autoClose={false}
          hideProgressBar={true}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          icon={true}
          pauseOnHover
        />
        {loader && <Loader />}
      </LoaderContext.Provider>
    </>
  );
}

export default App;
