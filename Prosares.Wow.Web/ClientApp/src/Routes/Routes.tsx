import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
// import CapacityAllocation from "../Pages/CapacityAllocation/CapacityAllocation";
import Header from "../Layout/Header/Header";
import Menubar from "../Layout/Menubar/Menubar";
import TaskAssignment from "../Pages/TaskAssignment/TaskAssignment";
import TicketAssignment from "../Pages/TicketAssignment/TicketAssignment";
import Bubble from "../Layout/Bubble/Bubble";
import Homescreen from "../Pages/Homescreen/Homescreen";
import CalendarUI from "../Components/Calendar/CalendarUI";
import CustomerMaster from "../Pages/Master/Customer/CustomerMaster";
import CustomerMasterEdit from "../Pages/Master/Customer/CustomerMasterEdit";
import EmployeeMaster from "../Pages/Master/Employee/EmployeeMaster";
import EmployeeMasterEdit from "../Pages/Master/Employee/EmployeeMasterEdit";
import MilestoneMaster from "../Pages/Master/Milestone/MilestoneMaster";
import MilestoneMasterEdit from "../Pages/Master/Milestone/MilestoneMasterEdit";
import EngagementMaster from "../Pages/Master/EngagementMaster/EngagementMaster";
import EngagementMasterEdit from "../Pages/Master/EngagementMaster/EngagementMasterEdit";
import ApplicationMaster from "../Pages/Master/Application/ApplicationMaster";
import ApplicationMasterEdit from "../Pages/Master/Application/ApplicationMasterEdit";
import CostCenterMaster from "../Pages/Master/CostCenter/CostCenterMaster";
import CostCenterEdit from "../Pages/Master/CostCenter/CostCenterEdit";
//import CostCenterMasterEdit from "../Pages/Master/CostCenter/CostCenterMasterEdit";
import LeaveMaster from "../Pages/Master/Leave/LeaveMaster";
import LeaveMasterEdit from "../Pages/Master/Leave/LeaveMasterEdit";
// import RequestLeave from "../Pages/RequestLeave/RequestLeave";
import jwt_decode from "jwt-decode";
// import { Dashboard } from "@mui/icons-material";
import Protected from "../Helpers/Protected";
import AccessDenied from "../Pages/Access Denied/AccessDenied";
import PhaseMaster from "../Pages/Master/Phase/PhaseMaster";
import PhaseMasterEdit from "../Pages/Master/Phase/PhaseMasterEdit";
import WorkPolicyMaster from "../Pages/Master/WorkPolicy/WorkPolicyMaster";
import WorkPolicyMasterEdit from "../Pages/Master/WorkPolicy/WorkPolicyMasterEdit";
import CapacityAllocationAMC from "../Pages/CapacityAllocation/CapacityAllocationAMC";
import CapacityAllocationTNM from "../Pages/CapacityAllocation/CapacityAllocationTNM";
import CapacityAllocationPROJECT from "../Pages/CapacityAllocation/CapacityAllocationPROJECT";
import ManagerDashboard from "../Pages/ManagerDashboard/ManagerDashboard";
import TimeSheetPolicy from "../Pages/Master/TimeSheetPolicy/TimeSheetPolicy";
import TimeSheetPolicyEdit from "../Pages/Master/TimeSheetPolicy/TimeSheetPolicyEdit";
import CapacityUtilizationReport from "../Pages/Report/CapacityUtilizationReport/CapacityUtilizationReport";
import ResourceCapacity from "../Pages/Report/ResourceCapacity/ResourceCapacity";
import MilestoneReport from "../Pages/Report/MileStonReport/MilestoneReport";

export const ApplicationContext = React.createContext({});
const Router = () => {
  let navigate = useNavigate();
  const [asidebar, setAsidebar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [context, setContext] = useState<any>({});
  const [env, setEnv] = useState<any>(
    process.env.REACT_APP_PUBLISH_PATH ? process.env.REACT_APP_PUBLISH_PATH : ""
  );
  var decoded;

  const mobileResMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    var token = getCookie("ApplicationToken");

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2)
        return parts
          .pop()
          .split(";")
          .shift();
    }
    if (token != undefined) {
      decoded = jwt_decode(token);

      if (decoded.IsFirstLogin === "True") {
        //navigate(`${env}/TaskDashboard`, { state: "true" }); // redirect this to Reset password page
      }
      setContext(decoded);
    }
  }, []);

  return (
    <>
      <ApplicationContext.Provider value={context}>
        <Header
          menuOpenFunc={mobileResMenu}
          setAsidebar={setAsidebar}
          aisebar={asidebar}
        />
        <div id="base">
          <div id="content">
            <div className="main-content">
              <Routes>
                <Route
                  path={`${env}/Dashboard`}
                  element={
                    <Protected permittedPages={"Dashboard"}>
                      <Homescreen />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/TicketDashboard/TicketAssignment`}
                  element={
                    <Protected permittedPages={"TicketAssignment"}>
                      <TicketAssignment />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/TaskDashboard/TaskAssignment`}
                  element={
                    <Protected permittedPages={"TaskAssignment"}>
                      <TaskAssignment />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/CapacityAllocation/AMC`}
                  element={
                    <Protected permittedPages={"CapacityAllocation"}>
                      <CapacityAllocationAMC />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/CapacityAllocation/TNM`}
                  element={
                    <Protected permittedPages={"CapacityAllocation"}>
                      <CapacityAllocationTNM />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/CapacityAllocation/PROJECT`}
                  element={
                    <Protected permittedPages={"CapacityAllocation"}>
                      <CapacityAllocationPROJECT />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/calendar`}
                  element={
                    <Protected permittedPages={"CalendarUI"}>
                      <CalendarUI />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/customer`}
                  element={
                    <Protected permittedPages={"CustomerMaster"}>
                      <CustomerMaster />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/milestone`}
                  element={
                    <Protected permittedPages={"MilestoneMaster"}>
                      <MilestoneMaster />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/employee`}
                  element={
                    <Protected permittedPages={"EmployeeMaster"}>
                      <EmployeeMaster />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/customer/edit`}
                  element={
                    <Protected permittedPages={"CustomerMasterEdit"}>
                      <CustomerMasterEdit />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/milestone/edit`}
                  element={
                    <Protected permittedPages={"MilestoneMasterEdit"}>
                      <MilestoneMasterEdit />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/employee/edit`}
                  element={
                    <Protected permittedPages={"EmployeeMasterEdit"}>
                      <EmployeeMasterEdit />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/engagement`}
                  element={
                    <Protected permittedPages={"EngagementMaster"}>
                      <EngagementMaster />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/engagement/edit`}
                  element={
                    <Protected permittedPages={"EngagementMasterEdit"}>
                      <EngagementMasterEdit />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/leaveRequest`}
                  element={
                    <Protected permittedPages={"LeaveMaster"}>
                      <LeaveMaster />
                    </Protected>
                  }
                />

                {/* <Route
                  path={`${env}/master/leaveRequest`}
                  element={<LeaveMaster />}
                /> */}

                <Route
                  path={`${env}/master/leaveRequest/edit`}
                  element={
                    <Protected permittedPages={"LeaveMasterEdit"}>
                      <LeaveMasterEdit />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/application`}
                  element={
                    <Protected permittedPages={"ApplicationMaster"}>
                      <ApplicationMaster />
                    </Protected>
                  }
                />
                <Route
                  path={`${env}/master/application/edit`}
                  element={
                    <Protected permittedPages={"ApplicationMasterEdit"}>
                      <ApplicationMasterEdit />
                    </Protected>
                  }
                />
                <Route
                  path={`${env}/master/phase`}
                  element={
                    <Protected permittedPages={"PhaseMaster"}>
                      <PhaseMaster />
                    </Protected>
                  }
                />
                <Route
                  path={`${env}/master/phase/edit`}
                  element={
                    <Protected permittedPages={"PhaseMasterEdit"}>
                      <PhaseMasterEdit />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/workpolicy`}
                  element={
                    <Protected permittedPages={"WorkPolicyMaster"}>
                      <WorkPolicyMaster />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/workpolicy/edit`}
                  element={
                    <Protected permittedPages={"WorkPolicyMasterEdit"}>
                      <WorkPolicyMasterEdit />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/costcenter`}
                  element={
                    <Protected permittedPages={"CostCenterMaster"}>
                      <CostCenterMaster />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/costcenter/edit`}
                  element={
                    <Protected permittedPages={"CostCenterMasterEdit"}>
                      <CostCenterEdit />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/timesheet`}
                  element={
                    <Protected permittedPages={"TimesheetMaster"}>
                      <TimeSheetPolicy />
                    </Protected>
                  }
                />

                <Route
                  path={`${env}/master/timesheet/edit`}
                  element={
                    <Protected permittedPages={"TimesheetMasterEdit"}>
                      <TimeSheetPolicyEdit />
                    </Protected>
                  }
                />

                {/* Reports */}
                <Route
                  path={`${env}/report/capacityutilization`}
                  element={
                    <Protected permittedPages={"CapacityUtilizationReport"}>
                      <CapacityUtilizationReport />
                    </Protected>
                  }
                />

                <Route
                  path="*"
                  element={<Navigate to={`${env}/Dashboard`} replace />}
                />

                <Route
                  path={`${env}/AccessDenied`}
                  element={<AccessDenied />}
                />

                {/* <Route
                  path="master/engagement"
                  element={<EngagementMaster />}
                />
                <Route
                  path="master/engagement/edit"
                  element={<EngagementMasterEdit />}
                />*/}
                <Route
                  path={`${env}/TaskDashboard`}
                  element={<ManagerDashboard />}
                />

                <Route
                  path={`${env}/TicketDashboard`}
                  element={<ManagerDashboard />}
                />
                <Route
                  path={`${env}/report/resourcecapactiy`}
                  element={<ResourceCapacity />}
                />

                <Route
                  path={`${env}/report/milestone`}
                  element={<MilestoneReport />}
                />
              </Routes>

              {/* <Routes>
                <Route path="/" element={<Homescreen />} />
                <Route path="/TaskAssignment" element={<TaskAssignment />} />
                <Route path="/TaskAssignment" element={<TaskAssignment />} />

                <Route
                  path="/TicketAssignment"
                  element={<TicketAssignment />}
                />
                <Route
                  path="/CapacityAllocation"
                  element={<CapacityAllocation />}
                />
                <Route path="/calendar" element={<CalendarUI />} />
                <Route
                  path="master"
                  element={<Navigate to="/master/customer" replace />}
                />
                <Route path="master/customer" element={<CustomerMaster />} />
                <Route path="master/milestone" element={<MilestoneMaster />} />
                <Route path="master/employee" element={<EmployeeMaster />} />
                <Route path="master/phase" element={<PhaseMaster />} />
                <Route
                  path="master/application"
                  element={<ApplicationMaster />}
                />
                <Route
                  path="master/costcenter"
                  element={<CostCenterMaster />}
                />
                <Route
                  path="master/workpolicy"
                  element={<WorkPolicyMaster />}
                />
                <Route
                  path="master/customer/edit"
                  element={<CustomerMasterEdit />}
                />
                <Route
                  path="master/milestone/edit"
                  element={<MilestoneMasterEdit />}
                />
                <Route
                  path="master/employee/edit"
                  element={<EmployeeMasterEdit />}
                />

                <Route
                  path="master/engagement"
                  element={<EngagementMaster />}
                />
                <Route
                  path="master/engagement/edit"
                  element={<EngagementMasterEdit />}
                />
                <Route path="master/phase/edit" element={<PhaseMasterEdit />} />
                <Route
                  path="master/application/edit"
                  element={<ApplicationMasterEdit />}
                />
                <Route
                  path="master/costcenter/edit"
                  element={<CostCenterEdit />}
                />
                <Route
                  path="master/workpolicy/edit"
                  element={<WorkPolicyMasterEdit />}
                />
                <Route
                  path="master/leaveRequest"
                  element={<LeaveMaster />}></Route>
                <Route
                  path="master/leaveRequest/edit"
                  element={<LeaveMasterEdit />}
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes> */}
            </div>
          </div>
          {/* <Bubble /> */}
          <Menubar menuOpen={menuOpen} />
        </div>
      </ApplicationContext.Provider>
    </>
  );
};

export default Router;
