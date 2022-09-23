import React, { useState, useEffect, useContext } from "react";
import { Card, Form } from "react-bootstrap";
import SelectForm from "../../Components/SelectForm/SelectForm";
import InputForm from "../../Components/InputForm/InputForm";
import "react-datepicker/dist/react-datepicker.css";
import "./TaskAssignment.css";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { APICall } from "../../Helpers/API/APICalls";
import { useLocation, useNavigate } from "react-router-dom";

import uuid from "react-uuid";
import {
  getAutoPopulatedAssignedHoursData,
  getAutoPopulatedDataForTask,
  GetDropDownList,
  InsertUpdateTask,
} from "../../Helpers/API/APIEndPoints";
import { useParams } from "react-router-dom";
import { ApplicationContext } from "../../Routes/Routes";
import { getContext, LoaderContext } from "../../Helpers/Context/Context";
import { TaskStatus } from "../../Common/CommonJson";

import moment from "moment";
import notify from "../../Helpers/ToastNotification";

function TaskAssignment() {
  let navigate = useNavigate();
  const { RoleId } = getContext();
  const location = useLocation();
  const [Engagement, setEngagement] = useState<any>({});
  const [EngagementOptions, setEngagementOptions] = useState<any>([]);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [fromDate, setFromDate] = React.useState<any>(null);
  const [toDate, setToDate] = React.useState<any>(null);
  const [RequirementID, setRequirementID] = useState<any>("");
  const [Requirement, setRequirement] = useState<any>("");
  const [Task, setTask] = useState<any>("");
  const [Description, setDescription] = useState<any>("");
  const [AssignedTo, setAssignedTo] = useState<any>({});
  const [AssignedToOptions, setAssignedToOptions] = useState<any>([]);

  const [Startbydate, setStartbydate] = React.useState<Date | null>(new Date());
  const [Completebydate, setCompletebydate] = React.useState<Date | null>(
    new Date()
  );
  const [PlannedHours, setPlannedHours] = useState<any>("");
  const [isChargable, setisChargable] = useState<any>(true);
  const [Reason, setReason] = useState<any>({});
  const [ReasonOptions, setReasonOptions] = useState<any>([]);

  const [allocatedMandays, setAllocatedMandays] = useState<any>("");
  const [assignedMandays, setAssignedMandays] = useState<any>("");
  const [balancedMandays, setBalancedMandays] = useState<any>("");
  const [allocatedHours, setAllocatedHours] = useState<any>("");
  const [assignedHours, setAssignedHours] = useState<any>("");
  const [isAdhoc, setIsAdHoc] = useState<boolean>(false);
  const context = getContext();

  const [formErrors, setFormErrors] = useState<any>({});
  let formErrorObj = {};

  const [env, setEnv] = useState<any>(
    process.env.REACT_APP_PUBLISH_PATH ? process.env.REACT_APP_PUBLISH_PATH : ""
  );

  const getAutoPopulateData = async () => {
    if (
      Engagement.engagementId !== null &&
      fromDate !== null &&
      toDate !== null
    ) {
      var postObj = {
        EngagementId: Engagement.engagementId,
        fromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
        toDate: moment(toDate).format(moment.HTML5_FMT.DATE),
      };

      var autoPopulateData = await APICall(
        getAutoPopulatedDataForTask,
        "POST",
        postObj
      );

      if (autoPopulateData.data != undefined || autoPopulateData.data != null) {
        setFormErrors({
          ...formErrors,
          ["fromDate_isEmpty"]: "",
        });

        setFormErrors({
          ...formErrors,
          ["toDate_isEmpty"]: "",
        });

        if (autoPopulateData.data.mandays == null) {
          autoPopulateData.data.mandays = 0;
        }
        setAllocatedMandays(autoPopulateData.data.mandays);
        setAssignedMandays(
          (autoPopulateData.data.hoursAssigned / 8.5).toFixed(2)
        );
        setBalancedMandays(
          (
            autoPopulateData.data.mandays -
            autoPopulateData.data.hoursAssigned / 8.5
          ).toFixed(2)
        );
      } else {
        //  setFromDate(null);
        // setToDate(null);
        setAllocatedMandays("");
        setAssignedMandays("");
        setBalancedMandays("");
        setAllocatedHours("");
        setAssignedHours("");
      }
    }
    // else {
    //   if (fromDate == undefined || fromDate == null || fromDate == "") {
    //     await setFormErrors({
    //       ...formErrors,
    //       ["fromDate_isEmpty"]: "from date cannot be empty",
    //     });
    //   }
    //   if (toDate == undefined || toDate == null || toDate == "") {
    //     await setFormErrors({
    //       ...formErrors,
    //       ["toDate_isEmpty"]: "To date cannot be empty",
    //     });
    //   }
    // }
  };

  useEffect(() => {
    getAutoPopulateData();
  }, [fromDate, toDate, Engagement]);

  const handleTextEvent = async (event: any, apiFieldName: any) => {
    if (!isAdhoc) {
      if (apiFieldName === "fromDate") {
        let date = event;
        await setFromDate(date);
        //    await  getAutoPopulateData();
        await setFormErrors({
          ...formErrors,
          ["fromDate_isEmpty"]: "",
        });

        if (event == undefined || event == null || event == "") {
          await setFormErrors({
            ...formErrors,
            ["fromDate_isEmpty"]: "From date cannot be empty",
          });
        }
      }
      if (apiFieldName === "toDate") {
        let date = event;
        await setToDate(date);
        //await getAutoPopulateData();
        await setFormErrors({
          ...formErrors,
          ["toDate_isEmpty"]: "",
        });

        if (event == undefined || event == null || event == "") {
          await setFormErrors({
            ...formErrors,
            ["toDate_isEmpty"]: "To date cannot be empty",
          });
        }
      }
    }
    if (apiFieldName === "RequirementId") {
      setRequirementID(event.target.value);
    }

    if (apiFieldName === "TaskDescription") {
      setDescription(event.target.value);
      await setFormErrors({
        ...formErrors,
        ["TaskDescription_isEmpty"]: "",
      });

      if (
        event.target.value == undefined ||
        event.target.value == null ||
        event.target.value == ""
      ) {
        await setFormErrors({
          ...formErrors,
          ["TaskDescription_isEmpty"]: "Task description cannot be empty",
        });
      }
    }

    if (apiFieldName === "PlannedHours") {
      setPlannedHours(event.target.value);
      await setFormErrors({
        ...formErrors,
        ["PlannedHours_isEmpty"]: "",
      });

      if (
        event.target.value == undefined ||
        event.target.value == null ||
        event.target.value == ""
      ) {
        await setFormErrors({
          ...formErrors,
          ["PlannedHours_isEmpty"]: "Planned Hours cannot be empty",
        });
      }
    }

    if (apiFieldName === "TaskTitle") {
      setTask(event.target.value);
      await setFormErrors({
        ...formErrors,
        ["TaskTitle_isEmpty"]: "",
      });

      if (
        event.target.value == undefined ||
        event.target.value == null ||
        event.target.value == ""
      ) {
        await setFormErrors({
          ...formErrors,
          ["TaskTitle_isEmpty"]: "Task Title cannot be empty",
        });
      }
    }
    if (apiFieldName === "Startbydate") {
      setStartbydate(event);
      await setFormErrors({
        ...formErrors,
        ["Startbydate_isEmpty"]: "",
      });

      if (event == undefined || event == null || event == "") {
        await setFormErrors({
          ...formErrors,
          ["Startbydate_isEmpty"]: "Start By date cannot be empty",
        });
      }
    }
    if (apiFieldName === "Completebydate") {
      setCompletebydate(event);
      await setFormErrors({
        ...formErrors,
        ["Completebydate_isEmpty"]: "",
      });

      if (event == undefined || event == null || event == "") {
        await setFormErrors({
          ...formErrors,
          ["Completebydate_isEmpty"]: "Complete By date cannot be empty",
        });
      }
    }
    if (apiFieldName === "Requirement") {
      setRequirement(event.target.value);
    }
    if (apiFieldName === "allocatedMandays") {
      setAllocatedMandays(event.target.value);
    }
    if (apiFieldName === "assignedMandays") {
      setAssignedMandays(event.target.value);
    }
    if (apiFieldName === "balancedMandays") {
      setBalancedMandays(event.target.value);
    }
    if (apiFieldName === "allocatedHours") {
      setAllocatedHours(event.target.value);
    }
    if (apiFieldName === "assignedHours") {
      setAssignedHours(event.target.value);
    }
  };

  const handleCheckEvent = async (checkedValue, apiFieldName) => {
    if (apiFieldName === "IsChargable") {
      await setFormErrors({
        ...formErrors,
        ["Reason_isEmpty"]: "",
      });
      let checkVal = checkedValue;
      await setisChargable(checkVal);
    }
  };
  const checkValidations = async () => {
    var objError = {};

    if (
      Engagement.engagementId == undefined ||
      Engagement.engagementId == null ||
      Engagement.engagementId == ""
    ) {
      objError["engagement_isEmpty"] = "Select Engagement";
    }

    if (!isAdhoc) {
      if (fromDate == undefined || fromDate == null || fromDate == "") {
        objError["fromDate_isEmpty"] = "From date cannot be empty";
      }

      if (toDate == undefined || toDate == null || toDate == "") {
        objError["toDate_isEmpty"] = "To date cannot be empty";
      }

      if (
        AssignedTo.value == undefined ||
        AssignedTo.value == null ||
        AssignedTo.value == ""
      ) {
        objError["AssignedTo_isEmpty"] = "Assigned To cannot be empty";
      }
    }

    if (Task == undefined || Task == null || Task == "") {
      objError["TaskTitle_isEmpty"] = "Task Title cannot be empty";
    }

    if (Description == undefined || Description == null || Description == "") {
      objError["TaskDescription_isEmpty"] = "Task Description cannot be empty";
    }

    if (Startbydate == undefined || Startbydate == null) {
      objError["Startbydate_isEmpty"] = "Start by date cannot be empty";
    }

    if (Completebydate == undefined || Completebydate == null) {
      objError["Completebydate_isEmpty"] = "Complete by date cannot be empty";
    }
    if (
      PlannedHours == undefined ||
      PlannedHours == null ||
      PlannedHours == "" ||
      isNaN(PlannedHours) ||
      PlannedHours <= 0
    ) {
      objError["PlannedHours_isEmpty"] = "Planned Hours cannot be empty";
    }
    if (!isChargable) {
      if (
        Reason.value == undefined ||
        Reason.value == null ||
        Reason.value == ""
      ) {
        objError["Reason_isEmpty"] = "Reason cannot be empty";
      }
    }

    formErrorObj = objError;
    await setFormErrors(objError);
  };
  const onClickFunction = async (event, action) => {
    if (action === "Submit") {
      await checkValidations();

      const isEmpty = await Object.values(formErrorObj).every(
        (x) => x === null || x === "" || x == undefined
      );

      if (isEmpty) {
        showLoader();

        let requestObject = {};
        requestObject = {
          TaskUid: uuid(),
          EngagementId: Engagement.engagementId,
          PhaseId: parseInt(Engagement.phasevalue),
          ApplicationId: parseInt(Engagement.applicationValue),
          RequirementId: null,
          TaskTitle: Task,
          TaskDescription: Description,
          AssignedTo: isAdhoc ? context.EmployeeId : AssignedTo.value,
          PlannedStartDate: moment(Startbydate).format(moment.HTML5_FMT.DATE),
          PlannedEndDate: moment(Completebydate).format(moment.HTML5_FMT.DATE),
          HoursAssigned: Number(PlannedHours).toFixed(2),
          HoursSpent: 0,
          TaskStatus: TaskStatus.NotStarted,
          IsChargeable: isChargable,
          CreatedBy: context.EmployeeId,
          CreatedDate: moment(new Date()).format(moment.HTML5_FMT.DATE),
          NoChargesReason: isChargable ? "" : Reason.label ? Reason.label : "",
        };

        const data = await APICall(InsertUpdateTask, "POST", requestObject);
        hideLoader();

        if (data.status === 0) {
          navigate(`${env}/TaskDashboard`, { state: "true" });
          notify(0, "Task inserted successfully");
        } else {
          notify(1, "Task insertion fail");
        }
      }
    } else {
      setFormErrors({});
      setEngagement({});
      setFromDate(null);
      setToDate(null);
      setRequirementID("");
      setRequirement("");
      setTask("");
      setDescription("");
      setAssignedTo({});
      setAssignedToOptions([]);
      setStartbydate(null);
      setCompletebydate(null);
      setPlannedHours("");
      setisChargable(false);
      setReason({});
      setAllocatedMandays("");
      setAssignedMandays("");
      setBalancedMandays("");
      setAllocatedHours("");
      setAssignedHours("");
    }
  };

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "Engagement") {
      if (event.engagementType === 5 || event.engagementType === 2) {
        setisChargable(false);
      } else {
        setisChargable(true);
      }
      setEngagement(event);
      await setFormErrors({
        ...formErrors,
        ["engagement_isEmpty"]: "",
      });
      if (event == undefined || event == null || event == "") {
        await setFormErrors({
          ...formErrors,
          ["engagement_isEmpty"]: "Select Engagement",
        });
      }
      var data = await CommonDropdownFunction("assignedTo", event.engagementId);

      if (data != undefined || data != null) {
        let tempArray = [];
        await data.map((employee) => {
          let tempObj = {
            value: employee.id,
            label: employee.name,
          };
          tempArray.push(tempObj);
        });
        tempArray.sort((a, b) => a.label.localeCompare(b.label));
        setAssignedToOptions(tempArray);
      }

      //Reasons Dropdown
      var reason = await CommonDropdownFunction("reason", event.engagementType);
      if (reason != undefined || reason != null) {
        let tempArray = [];
        await reason.map((reasons) => {
          let tempObj = {
            value: reasons.id,
            label: reasons.reason,
          };
          tempArray.push(tempObj);
        });
        setReasonOptions(tempArray);
      }
    }
    if (apiFieldName === "AssignedTo" && !isAdhoc) {
      setAssignedTo(event);

      var postObj = {
        EngagementId: Engagement.engagementId,
        EmployeeId: event.value,
        fromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
        toDate: moment(toDate).format(moment.HTML5_FMT.DATE),
      };

      var autoPopulateData = await APICall(
        getAutoPopulatedAssignedHoursData,
        "POST",
        postObj
      );

      if (autoPopulateData.data != undefined || autoPopulateData.data != null) {
        setAllocatedHours(
          autoPopulateData.data.hoursAllocated
            ? autoPopulateData.data.hoursAllocated * 8.5
            : 0
        );
        setAssignedHours(
          autoPopulateData.data.hoursAssigned
            ? autoPopulateData.data.hoursAssigned
            : 0
        );
      }
      await setFormErrors({
        ...formErrors,
        ["AssignedTo_isEmpty"]: "",
      });
      if (event == undefined || event == null || event == "") {
        await setFormErrors({
          ...formErrors,
          ["AssignedTo_isEmpty"]: "Select Assigned To",
        });
      }
    }
    if (apiFieldName === "Reason" && !isChargable) {
      setReason(event);
      await setFormErrors({
        ...formErrors,
        ["Reason_isEmpty"]: "",
      });
      if (!isChargable) {
        if (event == undefined || event == null || event == "") {
          await setFormErrors({
            ...formErrors,
            ["Reason_isEmpty"]: "Select Reason",
          });
        }
      }
    }
  };

  const onLoadAPI = async () => {
    //check of adHoc or NOt
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setFromDate(firstDay);
    setToDate(lastDay);

    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const type = urlParams.get("type");
    if (type == "adhoc") {
      setIsAdHoc(true);
    } else {
      setIsAdHoc(false);
    }
    //Engagement Dropdown

    let EmployeeId = context.EmployeeId; //hardcoded
    var data;
    if (RoleId.includes("3")) {
      var data = await CommonDropdownFunction(
        "engagementForManagerTask",
        EmployeeId
      );
    } else {
      var data = await CommonDropdownFunction("engagement", EmployeeId);
    }

    if (data != undefined || data != null) {
      let engagementArray = [];

      await data.map((engagement) => {
        let tempObj;
        if (engagement.phase != null) {
          tempObj = {
            phasevalue: engagement.phaseId,
            label: `${engagement.engagement}-${engagement.phase}`,
            value: uuid(),
            engagementId: engagement.engagementId,
            empId: engagement.employeeId,
            engagementType: engagement.engagementType,
          };
        } else if (engagement.application != null) {
          tempObj = {
            applicationValue: engagement.applicationId,
            label: ` ${engagement.engagement}-${engagement.application}`,
            value: uuid(),
            engagementId: engagement.engagementId,
            empId: engagement.employeeId,
            engagementType: engagement.engagementType,
          };
        } else {
          tempObj = {
            phasevalue: engagement.phaseId,
            label: `${engagement.engagement}`,
            value: uuid(),
            engagementId: engagement.engagementId,
            empId: engagement.employeeId,
            engagementType: engagement.engagementType,
          };
        }
        engagementArray.push(tempObj);
      });

      setEngagementOptions(engagementArray);
    }
  };

  const CommonDropdownFunction = async (searchFor, searchValue) => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let postObject = {
      searchFor: searchFor,
      searchValue: searchValue,
      fromDate: moment(firstDay).format(moment.HTML5_FMT.DATE),
      toDate: moment(lastDay).format(moment.HTML5_FMT.DATE),
    };

    const { data } = await APICall(GetDropDownList, "POST", postObject);

    return data;
  };
  useEffect(() => {
    onLoadAPI();
  }, [location]);
  return (
    <div>
      <section className="bg_breadcrumb">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h4>Task Assignment</h4>
            </div>
          </div>
        </div>
      </section>
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Engagement / Application/ Phase <sup>*</sup>
                </label>
                <SelectForm
                  options={EngagementOptions}
                  placeholder="Select"
                  isDisabled={false}
                  value={Engagement}
                  onChange={(event) => selectOnChange(event, "Engagement")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
              <p style={{ color: "red" }}>{formErrors["engagement_isEmpty"]}</p>
            </div>

            {!isAdhoc ? (
              <>
                <div className="col-lg-3 col-md-4 col-sm-6 align-self-end">
                  <div className="form-group">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="From date"
                        value={fromDate}
                        onChange={(e) => handleTextEvent(e, "fromDate")}
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField size="small" {...params} />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                  <p style={{ color: "red" }}>
                    {formErrors["fromDate_isEmpty"]}
                  </p>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 align-self-end">
                  <div className="form-group">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="To date"
                        value={toDate}
                        onChange={(e) => handleTextEvent(e, "toDate")}
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField size="small" {...params} />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                  <p style={{ color: "red" }}>{formErrors["toDate_isEmpty"]}</p>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Allocated Mandays</label>
                    <InputForm
                      placeholder={""}
                      isDisabled={true}
                      textArea={false}
                      value={allocatedMandays}
                      onChange={(e) => handleTextEvent(e, "allocatedMandays")}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Assigned Mandays</label>
                    <InputForm
                      placeholder={""}
                      isDisabled={true}
                      textArea={false}
                      value={assignedMandays}
                      onChange={(e) => handleTextEvent(e, "assignedMandays")}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Balance Mandays</label>
                    <InputForm
                      placeholder={""}
                      isDisabled={true}
                      textArea={false}
                      value={balancedMandays}
                      onChange={(e) => handleTextEvent(e, "balancedMandays")}
                    />
                  </div>
                </div>
              </>
            ) : null}

            {/* <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="form-group">
                                <label>Requirement ID</label>
                                <InputForm
                                    placeholder={""}
                                    isDisabled={false}
                                    textArea={false}
                                    value={RequirementID}
                                    onChange={(e) => handleTextEvent(e, "RequirementId")}
                                />
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-4 col-sm-6">
                            <div className="form-group">
                                <label>Requirement</label>
                                <InputForm
                                    placeholder={""}
                                    isDisabled={true}
                                    textArea={true}
                                    value={Requirement}
                                    onChange={(e) => handleTextEvent(e, "requirement")}
                                />
                            </div>
                        </div> */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Task Title<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={Task}
                  onChange={(e) => handleTextEvent(e, "TaskTitle")}
                />
              </div>
              <p style={{ color: "red" }}>{formErrors["TaskTitle_isEmpty"]}</p>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="form-group">
                <label>IsChargeable</label>
                <br />
                <label style={{ float: "left" }}>No</label>
                <Form style={{ float: "left" }}>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label=""
                    onChange={(e) =>
                      handleCheckEvent(e.target.checked, "IsChargable")
                    }
                    checked={isChargable}
                  />
                </Form>
                <label style={{ float: "left" }}>Yes</label>
              </div>
            </div>

            {!isChargable ? (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>
                    Reason, if not chargeable<sup>*</sup>
                  </label>
                  <SelectForm
                    options={ReasonOptions}
                    placeholder="Select"
                    isDisabled={false}
                    value={Reason}
                    onChange={(event) => selectOnChange(event, "Reason")}
                    isMulti={false}
                    noIndicator={false}
                    noSeparator={false}
                  />
                </div>
                <p style={{ color: "red" }}>{formErrors["Reason_isEmpty"]}</p>
              </div>
            ) : null}
            <div className="row">
              {!isAdhoc ? (
                <>
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="form-group">
                      <label>
                        Assigned to<sup>*</sup>
                      </label>
                      <SelectForm
                        key={1}
                        options={AssignedToOptions}
                        placeholder="Select"
                        isDisabled={false}
                        value={AssignedTo}
                        onChange={(event) =>
                          selectOnChange(event, "AssignedTo")
                        }
                        isMulti={false}
                        noIndicator={false}
                        noSeparator={false}
                      />
                    </div>
                    <p style={{ color: "red" }}>
                      {formErrors["AssignedTo_isEmpty"]}
                    </p>
                  </div>
                </>
              ) : null}
              <div className="col-lg-3 col-md-4 col-sm-6 align-self-end">
                <div className="form-group">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start by date"
                      value={Startbydate}
                      onChange={(e) => handleTextEvent(e, "Startbydate")}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                        <TextField size="small" required {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </div>
                <p style={{ color: "red" }}>
                  {formErrors["Startbydate_isEmpty"]}
                </p>
              </div>

              <div className="col-lg-3 col-md-4 col-sm-6 align-self-end">
                <div className="form-group">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Complete by date"
                      value={Completebydate}
                      onChange={(e) => handleTextEvent(e, "Completebydate")}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                        <TextField size="small" required {...params} />
                      )}
                      minDate={Startbydate}
                    />
                  </LocalizationProvider>
                </div>
                <p style={{ color: "red" }}>
                  {formErrors["Completebydate_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <Form.Label>
                    Planned Hours<sup>*</sup>
                  </Form.Label>
                  <InputForm
                    placeholder={""}
                    className={"numRight"}
                    isDisabled={false}
                    textArea={false}
                    type="number"
                    value={PlannedHours}
                    onChange={(e) => handleTextEvent(e, "PlannedHours")}
                    onKeyPress={(event) => {
                      if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
                <p style={{ color: "red" }}>
                  {formErrors["PlannedHours_isEmpty"]}
                </p>
              </div>
              {!isAdhoc ? (
                <>
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="form-group">
                      <Form.Label>Allocated Hours</Form.Label>
                      <InputForm
                        placeholder={""}
                        className={"numRight"}
                        isDisabled={true}
                        textArea={false}
                        value={allocatedHours}
                        onChange={(e) => handleTextEvent(e, "allocatedHours")}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="form-group">
                      <Form.Label>Assigned Hours</Form.Label>
                      <InputForm
                        placeholder={""}
                        className={"numRight"}
                        isDisabled={true}
                        textArea={false}
                        value={assignedHours}
                        onChange={(e) => handleTextEvent(e, "assignedHours")}
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Task Description<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={true}
                  value={Description}
                  rows={4}
                  onChange={(e) => handleTextEvent(e, "TaskDescription")}
                />
              </div>
              <p style={{ color: "red" }}>
                {formErrors["TaskDescription_isEmpty"]}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="float-right">
                <button
                  className="btn btn-reset ml-1"
                  onClick={(e) => onClickFunction(e, "Reset")}
                >
                  Reset
                </button>
                <button
                  style={{ background: "#96c61c" }}
                  className="btn btn-save ml-1"
                  onClick={(e) => onClickFunction(e, "Submit")}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TaskAssignment;
