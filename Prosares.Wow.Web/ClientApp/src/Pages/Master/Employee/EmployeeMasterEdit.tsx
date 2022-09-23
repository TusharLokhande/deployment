import React, { useEffect, useRef, useState } from "react";
import "./EmployeeMaster.css";
import { useLocation, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  GetDropDownList,
  getEmployeeByIdUrl,
  InsertUpdateEmployeeMasterData,
} from "../../../Helpers/API/APIEndPoints";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import InputForm from "../../../Components/InputForm/InputForm";
import { gd } from "date-fns/locale";
import notify from "../../../Helpers/ToastNotification";
import Heading from "../../../Components/Heading/Heading";
import { getContext } from "../../../Helpers/Context/Context";
//import { Password } from "@mui/icons-material";

const EmployeeMasterEdit = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [employeeId, setEmployeeId] = useState();
  const [employeeEid, setEmployeeEid] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeShortName, setEmployeeShortName] = useState("");
  const [CostCenter, setCostCenter] = useState<any>({});
  const [WorkPolicy, setWorkPolicy] = useState<any>({});
  const [TimesheetPolicy, setTimesheetPolicy] = useState<any>({});
  const timesheetPolicyId = useRef<any>(0);
  const [Efficiency, setEfficiency] = useState<any>({});
  const EfficiencyId = useRef<any>(0);
  const [employeeCostCenterOption, setEmployeeCostcenterOption] = useState<any>(
    []
  );
  const [employeeWorkPolicyOption, setEmployeeWorkPolicyOption] = useState<any>(
    []
  );
  const [
    employeeTimesheetPolicyOption,
    setEmployeeTimesheetPolicyOption,
  ] = useState<any>([]);
  const [employeeEfficiencyOption, setEmployeeEfficiencyOPtion] = useState<any>(
    []
  );
  const [employeeLoginId, setEmployeeLoginId] = useState("");
  // const [employeePassword, setEmployeePassword] = useState("");
  const [employeeRole, setEmployeeRole] = useState<any>(null);
  const employeeRoleIds = useRef<any>();
  const [leaveBalance, setLeaveBalance] = useState<any>("");
  const [employeeRoleOption, setEmployeeRoleOption] = useState<any>([]);
  const [reportingManager, setReportingManager] = useState(null);
  const [reportingManagerOption, setReportingManagerOption] = useState([]);
  const reportingManagerId = useRef<any>();
  //const [employeeEfficiency, setemployeeEfficiency] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);

  const { EmployeeId } = getContext();

  const getEmpById = async () => {
    if (state !== null) {
      let post = {
        id: state,
      };

      const { data } = await APICall(getEmployeeByIdUrl, "POST", post);
      console.log(data);
      if (data !== null || typeof data !== "string") {
        setEmployeeId(data[0].id);
        setEmployeeEid(data[0].eid);
        setEmployeeName(data[0].name);
        setEmployeeShortName(data[0].shortName);
        setCostCenter({
          value: data[0].costCenterId,
          label: data[0].costCenter,
        });
        setWorkPolicy({
          value: data[0].workPolicyId,
          label: data[0].workPolicy,
        });
        timesheetPolicyId.current = data[0].timeSheetPolicy;
        EfficiencyId.current = data[0].efficiency;
        setIsActive(data[0].isActive);
        setEmployeeLoginId(data[0].loginId);
        // setEmployeePassword(data[0].password);
        setLeaveBalance(data[0].leaveBalance);
        employeeRoleIds.current = data[0].employeeRoleIds;
        reportingManagerId.current = data[0].reportingManagerId;
        setLocation(data[0].location);
      }
    }
  };

  const onLoadApiCall = async () => {
    await getEmpById();
    await getCostCenterData();
    await getWorkPolicyData();
    await getTimeSheetData();
    await getEfficiencyData();
    await getEmployeeRoles();
    await getAllEmployees();
  };

  useEffect(() => {
    onLoadApiCall();
  }, []);

  const CommonDropdownFunction = async (searchFor, searchValue) => {
    let postObject = {
      searchFor: searchFor,
      searchValue: searchValue,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);

    return data;
  };

  //CostCenter Dropdown from databse
  const getCostCenterData = async () => {
    let costcenterId = 1; //hardcoded
    var data = await CommonDropdownFunction("costcenter", costcenterId);

    if (data != undefined || data != null) {
      let costCenterArray = [];
      await data.map((costCenter) => {
        let tempObj = {
          value: costCenter.id,
          label: costCenter.costCenter1,
        };
        costCenterArray.push(tempObj);
      });

      setEmployeeCostcenterOption(costCenterArray);
    }
  };

  //workPolicy Dropdown
  const getWorkPolicyData = async () => {
    let workpolicyId = 1; //hardcoded

    //workPolicy Dropdown
    var data = await CommonDropdownFunction("policyname", workpolicyId);

    if (data != undefined || data != null) {
      let workPolicyArray = [];
      await data.map((workPolicy) => {
        let tempObj = {
          value: workPolicy.id,
          label: workPolicy.policyName,
        };
        workPolicyArray.push(tempObj);
      });

      setEmployeeWorkPolicyOption(workPolicyArray);
    }
  };

  //TimesheetPolicy Dropdown
  const getTimeSheetData = async () => {
    let serchValueId = 1; //hardcoded
    var data = await CommonDropdownFunction("timesheet", serchValueId);

    if (data != undefined || data != null) {
      if (data.length > 0) {
        setEmployeeTimesheetPolicyOption(data);
        if (timesheetPolicyId.current !== 0) {
          let bindData = data.find(
            (ele) => ele.value === timesheetPolicyId.current
          );
          setTimesheetPolicy(bindData);
        }
      }
    }
  };

  //Efficency Dropdown
  const getEfficiencyData = async () => {
    let serachValueId = 1; //hardcoded
    var data = await CommonDropdownFunction("efficiency", serachValueId);

    if (data != undefined || data != null) {
      if (data.length > 0) {
        setEmployeeEfficiencyOPtion(data);
        if (EfficiencyId.current !== 0) {
          let bindData = data.find((ele) => ele.value === EfficiencyId.current);
          setEfficiency(bindData);
        }
      }
    }
  };

  //roles Dropdown
  const getEmployeeRoles = async () => {
    let serachValueId = 1; //hardcoded
    var data = await CommonDropdownFunction("employeeRoles", serachValueId);

    if (data != undefined || data != null) {
      if (data.length > 0) {
        setEmployeeRoleOption(data);

        if (
          employeeRoleIds.current !== undefined &&
          employeeRoleIds.current.length > 0
        ) {
          let employeeRolesArr = [];
          employeeRoleIds.current.forEach((element) => {
            let bindData = data.find((ele) => ele.value === element);
            employeeRolesArr.push(bindData);
          });
          setEmployeeRole(employeeRolesArr);
        }
      }
    }
  };
  //Reporting Manager Dropdown
  const getAllEmployees = async () => {
    let serachValueId = 1; //hardcoded
    var data = await CommonDropdownFunction("employee", serachValueId);

    if (data != undefined || data != null) {
      if (data.length > 0) {
        let employeeArr = [];
        await data.map((employee) => {
          let tempObj = {
            value: employee.id,
            label: employee.name,
          };
          employeeArr.push(tempObj);
        });
        setReportingManagerOption(employeeArr);
        if (reportingManagerId.current !== 0) {
          let bindData = employeeArr.find(
            (ele) => ele.value === reportingManagerId.current
          );
          setReportingManager(bindData);
        }
      }
    }
  };

  const getDataOnSubmit = async (requestObject: any) => {
    if (requestObject !== null) {
      const res = await APICall(
        InsertUpdateEmployeeMasterData,
        "POST",
        requestObject
      );
      if (res.status === 1) {
        notify(res.status, res.message);
      } else {
        navigate(-1);
      }
    }
  };

  const checkValidation = (requestObject) => {
    const checkArr = [
      "eid",
      "name",
      "shortName",
      "loginId",
      // "password",
      "costCenterId",
      "efficiency",
      "timeSheetPolicy",
      "workPolicyId",
      "leaveBalance",
      "employeeRole",
      "reportingManagerId",
    ];

    let validator = false;

    for (let i = 0; i < checkArr.length; i++) {
      if (
        requestObject[checkArr[i]] === "" ||
        requestObject[checkArr[i]] === undefined ||
        requestObject[checkArr[i]] === null ||
        requestObject[checkArr[i]] < 0
      ) {
        validator = true;
        break;
      }
    }

    return validator;
  };

  const onClickFunction = async (action) => {
    if (action === "submit") {
      let requestObject = {
        id: employeeId,
        eid: employeeEid,
        name: employeeName,
        shortName: employeeShortName,
        costCenterId: CostCenter ? CostCenter.value : null,
        workPolicyId: WorkPolicy ? WorkPolicy.value : null,
        timeSheetPolicy: TimesheetPolicy ? TimesheetPolicy.value : null,
        efficiency: Efficiency ? Efficiency.value : null,
        isActive: isActive,
        loginId: employeeLoginId,
        // password: employeePassword,
        leaveBalance: parseFloat(parseFloat(leaveBalance).toFixed(1)),
        employeeRole: employeeRole,
        reportingManagerId: reportingManager ? reportingManager.value : null,
        createdBy: Number(EmployeeId),
        modifiedBy: Number(EmployeeId),
        Location: location,
      };

      //submitApiCall
      const validate = checkValidation(requestObject);

      let emailIsValid;
      //check if email is valid
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          requestObject.loginId
        )
      ) {
        emailIsValid = true;
      } else {
        emailIsValid = false;
      }

      if (validate) {
        notify(1, "Please fill required fields!");
      } else if (emailIsValid === false) {
        notify(1, "Email Id not valid!");
      } else {
        await getDataOnSubmit(requestObject);
      }
    }
    if (action === "reset") {
      setEmployeeEid("");
      setEmployeeName("");
      setEmployeeShortName("");
      setCostCenter(null);
      setWorkPolicy(null);
      setTimesheetPolicy(null);
      setEfficiency(null);
      setEmployeeLoginId("");
      // setEmployeePassword("");
      setLeaveBalance("");
      setEmployeeRole(null);
      setReportingManager(null);
    }
  };

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "CostCenter") {
      setCostCenter(event);
    }
    if (apiFieldName === "workPolicy") {
      setWorkPolicy(event);
    }
    if (apiFieldName === "TimesheetPolicy") {
      setTimesheetPolicy(event);
    }
    if (apiFieldName === "Efficiency") {
      setEfficiency(event);
    }
    if (apiFieldName === "Roles") {
      setEmployeeRole(event);
    }
    if (apiFieldName === "reportingManager") {
      setReportingManager(event);
    }

    if (apiFieldName == "location") {
      setLocation(event);
    }
  };

  return (
    <div>
      <Heading title={"Employee Master"} />
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Employee Id<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={employeeEid}
                  onChange={(e) => setEmployeeEid(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Employee Name<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Employee Short Name<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={employeeShortName}
                  onChange={(e) => setEmployeeShortName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Cost Center<sup>*</sup>
                </label>
                <SelectForm
                  options={employeeCostCenterOption}
                  placeholder="Select"
                  isDisabled={false}
                  value={CostCenter}
                  onChange={(event) => selectOnChange(event, "CostCenter")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Work Policy<sup>*</sup>
                </label>
                <SelectForm
                  options={employeeWorkPolicyOption}
                  placeholder="Select"
                  isDisabled={false}
                  value={WorkPolicy}
                  onChange={(event) => selectOnChange(event, "workPolicy")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Timesheet Policy<sup>*</sup>
                </label>
                <SelectForm
                  key={1}
                  options={employeeTimesheetPolicyOption}
                  placeholder="Select"
                  isDisabled={false}
                  value={TimesheetPolicy}
                  onChange={(event) => selectOnChange(event, "TimesheetPolicy")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Efficiency<sup>*</sup>
                </label>
                <SelectForm
                  key={1}
                  options={employeeEfficiencyOption}
                  placeholder="Select"
                  isDisabled={false}
                  value={Efficiency}
                  onChange={(event) => selectOnChange(event, "Efficiency")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Role<sup>*</sup>
                </label>
                <SelectForm
                  options={employeeRoleOption}
                  placeholder="Select"
                  isDisabled={false}
                  value={employeeRole}
                  onChange={(event) => selectOnChange(event, "Roles")}
                  isMulti={true}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Reporting Manager<sup>*</sup>
                </label>
                <SelectForm
                  options={reportingManagerOption}
                  placeholder="Select"
                  isDisabled={false}
                  value={reportingManager}
                  onChange={(event) =>
                    selectOnChange(event, "reportingManager")
                  }
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Login Id<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={employeeLoginId}
                  onChange={(e) => setEmployeeLoginId(e.target.value)}
                  type={"email"}
                />
              </div>
            </div>
            {/* <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Password<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  type="password"
                  value={employeePassword}
                  onChange={(e) => setEmployeePassword(e.target.value)}
                />
              </div>
            </div> */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Location<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Leave Balance<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={leaveBalance}
                  onChange={(e) => setLeaveBalance(e.target.value)}
                  className="numRight"
                  type="number"
                  onKeyPress={(event) => {
                    if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 align-self-end">
              <div className="form-group">
                <label htmlFor="isActive" className="d-inline-block mr-2">
                  Is Active
                </label>
                <input
                  id="isActive"
                  type="checkbox"
                  onChange={(e) => setIsActive(e.target.checked)}
                  name="isActive"
                  checked={isActive}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              onClick={() => onClickFunction("reset")}
              className="btn btn-reset ml-1"
            >
              Reset
            </button>
            <button
              style={{ background: "#96c61c" }}
              onClick={() => onClickFunction("submit")}
              className="btn btn-save ml-1"
            >
              Submit
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Back
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployeeMasterEdit;
