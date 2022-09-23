import React, { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import SelectForm from "../../Components/SelectForm/SelectForm";
import InputForm from "../../Components/InputForm/InputForm";
import "./TicketAssignment.css";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { APICall } from "../../Helpers/API/APICalls";
import {
  getAutoPopulatedDataForTicket,
  GetDropDownList,
  getEngagementMasterDataById,
  InsertUpdateTicketData,
} from "../../Helpers/API/APIEndPoints";
import uuid from "react-uuid";
import moment from "moment";
import {
  notChargableResonsOptions,
  priorityOptions,
  TicketStatus,
  TicketType,
} from "../../Common/CommonJson";
import { useLocation, useNavigate } from "react-router-dom";
import { getContext, LoaderContext } from "../../Helpers/Context/Context";
import notify from "../../Helpers/ToastNotification";

const TicketAssignment = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const { RoleId } = getContext();
  const [Engagement, setEngagement] = useState<any>({});
  const [EngagementOptions, setEngagementOptions] = useState<any>([]);
  const [assignedToOptions, setAssignedToOptions] = useState<any>([]);
  const [fromDate, setFromDate] = React.useState<any>(
    moment()
      .startOf("month")
      .toDate()
  );
  const [toDate, setToDate] = React.useState<any>(
    moment()
      .endOf("month")
      .toDate()
  );
  const [ticket, setTicket] = useState<any>("");
  const [ticketTitle, setTicketTitle] = useState<any>("");
  const [Description, setDescription] = useState<any>("");
  const [AssignedTo, setAssignedTo] = useState<any>({});
  const [Startbydate, setStartbydate] = React.useState<Date | null>(new Date());
  const [Completebydate, setCompletebydate] = React.useState<Date | null>(
    new Date()
  );
  const [PlannedHours, setPlannedHours] = useState<any>("");
  const [isChargable, setisChargable] = useState<any>(true);
  const [Reason, setReason] = useState<any>({});
  const [allocatedMandays, setAllocatedMandays] = useState<any>("");
  const [assignedMandays, setAssignedMandays] = useState<any>("");
  const [balancedMandays, setBalancedMandays] = useState<any>("");
  const [priority, setPriority] = useState<any>({});
  const [incidentDate, setIncidentDate] = React.useState<Date | null>(
    new Date()
  );
  const [reportedDate, setReportedDate] = React.useState<Date | null>(
    new Date()
  );
  const [prevTicket, setPrevTicket] = useState<any>("");
  const [prevTicketId, setPrevTicketId] = useState<any>("");
  const [isAdhoc, setIsAdHoc] = useState<boolean>(false);
  const [type, setType] = useState<any>(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const context = getContext();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [ReasonOptions, setReasonOptions] = useState<any>([]);
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
        getAutoPopulatedDataForTicket,
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

  // useEffect(() => {
  //   getAutoPopulateData();
  // }, [toDate]);

  const checkValidations = async () => {
    var objError = {};
    if (!Engagement || Object.keys(Engagement).length === 0) {
      formErrorObj["Engagement_isEmpty"] = "Engagement can not be empty";
    }
    if (!isAdhoc) {
      if (fromDate == undefined || fromDate == null) {
        objError["fromDate_isEmpty"] = "From date cannot be empty";
      }
      if (toDate == undefined || toDate == null) {
        objError["toDate_isEmpty"] = "To date cannot be empty";
      }
      if (!assignedMandays || assignedMandays === "") {
        formErrorObj["assignedMandays_isEmpty"] =
          "Assigned Mandays can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(assignedMandays)) {
        formErrorObj["assignedMandays_isEmpty"] =
          "Assigned Mandays should have maximum 2 decimals only";
      }
      if (!allocatedMandays || allocatedMandays === "") {
        formErrorObj["allocatedMandays_isEmpty"] =
          "Allocated Mandays can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(allocatedMandays)) {
        formErrorObj["allocatedMandays_isEmpty"] =
          "Allocated Mandays should have maximum 2 decimals only";
      }
      if (
        !balancedMandays ||
        balancedMandays === "" ||
        balancedMandays === undefined
      ) {
        formErrorObj["balancedMandays_isEmpty"] =
          "Balance Mandays can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(balancedMandays)) {
        formErrorObj["balancedMandays_isEmpty"] =
          "Balance Mandays should have maximum 2 decimals only";
      }
      if (
        AssignedTo.value == undefined ||
        AssignedTo.value == null ||
        AssignedTo.value == ""
      ) {
        objError["AssignedTo_isEmpty"] = "Assigned to cannot be empty";
      }
    }
    if (
      Engagement.engagementId == undefined ||
      Engagement.engagementId == null ||
      Engagement.engagementId === ""
    ) {
      objError["Engagement_isEmpty"] = "Engagement cannot be empty";
    }
    if (
      ticketTitle == undefined ||
      ticketTitle == null ||
      ticketTitle.trim() === ""
    ) {
      objError["ticketTitle_isEmpty"] = "Ticket title to cannot be empty";
    }
    if (
      ticketTitle == undefined ||
      ticketTitle == null ||
      ticketTitle.trim() === ""
    ) {
      objError["ticketTitle_isEmpty"] = "Ticket title to cannot be empty";
    }
    if (
      Description == undefined ||
      Description == null ||
      Description.trim() === ""
    ) {
      objError["Description_isEmpty"] = "Ticket Description to cannot be empty";
    }
    if (Description == undefined || Description == null || Description == "") {
      objError["Allocated_isEmpty"] = "Description cannot be empty";
    }
    if (Startbydate == undefined || Startbydate == null) {
      objError["Startbydate_isEmpty"] = "Start by date cannot be empty";
    }
    if (Completebydate == undefined || Completebydate == null) {
      objError["Completebydate_isEmpty"] = "Resolved by date cannot be empty";
    }
    if (incidentDate == undefined || incidentDate == null) {
      objError["incidentDate_isEmpty"] = "Incident date cannot be empty";
    }
    if (reportedDate == undefined || reportedDate == null) {
      objError["reportedDate_isEmpty"] = "Reported date cannot be empty";
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
    if (isChargable === false) {
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

  const handleTextEvent = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "fromDate") {
      setFromDate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["fromDate_isEmpty"]: undefined,
        }));
        formErrorObj["fromDate_isEmpty"] = undefined;
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["fromDate_isEmpty"]: "From date can not be empty",
        }));
        formErrorObj["fromDate_isEmpty"] = "From date can not be empty";
      }
    }
    if (apiFieldName === "toDate") {
      setToDate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["toDate_isEmpty"]: undefined,
        }));
        formErrorObj["toDate_isEmpty"] = undefined;
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["toDate_isEmpty"]: "To date can not be empty",
        }));
        formErrorObj["toDate_isEmpty"] = "To date can not be empty";
      }
    }
    if (apiFieldName === "incidentDate") {
      setIncidentDate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["incidentDate_isEmpty"]: undefined,
        }));
        formErrorObj["incidentDate_isEmpty"] = undefined;
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["incidentDate_isEmpty"]: "Incident date can not be empty",
        }));
        formErrorObj["incidentDate_isEmpty"] = "Incident date can not be empty";
      }
    }
    if (apiFieldName === "reportedDate") {
      setReportedDate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["reportedDate_isEmpty"]: undefined,
        }));
        formErrorObj["reportedDate_isEmpty"] = undefined;
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["reportedDate_isEmpty"]: "Reported date can not be empty",
        }));
        formErrorObj["reportedDate_isEmpty"] = "Reported date can not be empty";
      }
    }
    if (apiFieldName === "ticket") {
      setTicket(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["ticket_isEmpty"]: undefined,
        }));
        formErrorObj["ticket_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["ticket_isEmpty"]: "Ticket can not be empty",
        }));
        formErrorObj["ticket_isEmpty"] = "Ticket can not be empty";
      }
    }
    if (apiFieldName === "prevTicket") {
      setPrevTicket(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["prevTicket_isEmpty"]: undefined,
        }));
        formErrorObj["prevTicket_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["prevTicket_isEmpty"]: "Previous ticket can not be empty",
        }));
        formErrorObj["prevTicket_isEmpty"] = "Previous ticket can not be empty";
      }
    }
    if (apiFieldName === "prevTicketId") {
      setPrevTicketId(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["prevTicketId_isEmpty"]: undefined,
        }));
        formErrorObj["prevTicketId_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["prevTicketId_isEmpty"]: "Previous ticket id can not be empty",
        }));
        formErrorObj["prevTicketId_isEmpty"] =
          "Previous ticket id can not be empty";
      }
    }
    if (apiFieldName === "ticketTitle") {
      setTicketTitle(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["ticketTitle_isEmpty"]: undefined,
        }));
        formErrorObj["ticketTitle_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["ticketTitle_isEmpty"]: "Ticket title can not be empty",
        }));
        formErrorObj["ticketTitle_isEmpty"] = "Ticket title can not be empty";
      }
    }
    if (apiFieldName === "Description") {
      setDescription(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["Description_isEmpty"]: undefined,
        }));
        formErrorObj["Description_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["Description_isEmpty"]: "Description can not be empty",
        }));
        formErrorObj["Description_isEmpty"] = "Description can not be empty";
      }
    }
    if (apiFieldName === "PlannedHours") {
      setPlannedHours(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["PlannedHours_isEmpty"]: undefined,
        }));
        formErrorObj["PlannedHours_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["PlannedHours_isEmpty"]: "Planned hours can not be empty",
        }));
        formErrorObj["PlannedHours_isEmpty"] = "Planned hours can not be empty";
      }
    }
    if (apiFieldName === "Startbydate") {
      setStartbydate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["Startbydate_isEmpty"]: undefined,
        }));
        formErrorObj["Startbydate_isEmpty"] = undefined;
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["Startbydate_isEmpty"]: "Start by date can not be empty",
        }));
        formErrorObj["Startbydate_isEmpty"] = "Start by date can not be empty";
      }
    }
    if (apiFieldName === "Completebydate") {
      setCompletebydate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["Completebydate_isEmpty"]: undefined,
        }));
        formErrorObj["Completebydate_isEmpty"] = undefined;
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["Completebydate_isEmpty"]: "Resolved by date can not be empty",
        }));
        formErrorObj["Completebydate_isEmpty"] =
          "Resolved by date can not be empty";
      }
    }
    if (apiFieldName === "allocatedMandays") {
      setAllocatedMandays(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["allocatedMandays_isEmpty"]: undefined,
        }));
        formErrorObj["allocatedMandays_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["allocatedMandays_isEmpty"]: "Allocated mandays can not be empty",
        }));
        formErrorObj["allocatedMandays_isEmpty"] =
          "Allocated mandays can not be empty";
      }
    }
    if (apiFieldName === "assignedMandays") {
      setAssignedMandays(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["assignedMandays_isEmpty"]: undefined,
        }));
        formErrorObj["assignedMandays_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["assignedMandays_isEmpty"]: "Assigned mandays can not be empty",
        }));
        formErrorObj["assignedMandays_isEmpty"] =
          "Assigned mandays can not be empty";
      }
    }
    if (apiFieldName === "balancedMandays") {
      setBalancedMandays(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["balancedMandays_isEmpty"]: undefined,
        }));
        formErrorObj["balancedMandays_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["balancedMandays_isEmpty"]: "balanced Mandays can not be empty",
        }));
        formErrorObj["balancedMandays_isEmpty"] =
          "Balanced mandays can not be empty";
      }
    }
  };

  const handleCheckEvent = async (checkedValue, apiFieldName) => {
    if (apiFieldName === "isChargable") {
      setFormErrors((preState) => ({
        ...preState,
        ["Reason_isEmpty"]: undefined,
      }));
      formErrorObj["Reason_isEmpty"] = undefined;
      setReason({});
      setisChargable(checkedValue);
    }
    if (apiFieldName === "type") {
      setType(checkedValue);
    }
  };

  const getCapacityEngagementByIdApiCall = async (engagementId: any) => {
    if (engagementId !== 0) {
      let post = {
        id: engagementId,
      };
      const { data } = await APICall(getEngagementMasterDataById, "POST", post);
      if (data !== null || typeof data !== "string") {
        {
          //     "id": 2,
          //     "engagement": "New Engagement",
          //     "engagementType": 1,
          //     "pomonths": 12,
          //     "pomanDaysPerMonth": 123,
          //     "budgetMandaysPerMonth": 456,
          //     "spentMandates": 123,
          //     "balanceMandays": 123,
          //     "pomanDays": null,
          //     "budgetMandays": null,

          // setAllocatedMandays()
          // setAssignedMandays()
          setBalancedMandays(data.balanceMandays);

          // setPoMandaysPerMonth(data.pomanDaysPerMonth)
          // setBudgetMandaysPerMonth(data.budgetMandaysPerMonth)
          // setAllocatedMandaysPerMonth(data.allocatedMandaysPerMonth)
          // setSpentMandays(data.spentMandates)
          // setBalanceMandays(data.balanceMandays)
          // setPoMandays(data.pomanDays)
          // setBudgetMandays(data.budgetMandays)
        }
      }
    }
  };
  const onClickFunction = async (action) => {
    if (action === "submit") {
      await checkValidations();
      const isEmpty = await Object.values(formErrorObj).every(
        (x) => x === null || x === "" || x == undefined
      );
      if (isEmpty) {
        showLoader();
        let requestObject = {
          TaskUid: uuid(),
          TaskTitle: "", //
          EngagementId: Engagement.engagementId,
          TicketTitle: ticketTitle,
          PhaseId: parseInt(Engagement.phasevalue),
          ApplicationId: parseInt(Engagement.applicationValue),
          TicketDescription: Description,
          AssignedTo: isAdhoc ? context.EmployeeId : AssignedTo.value, //7 //AssignedTo.value,
          Priority: priority.value,
          TicketNatureOfIssue: priority.value,
          HoursAssigned: Number(PlannedHours).toFixed(2),
          IncidentDate: moment(incidentDate).format(moment.HTML5_FMT.DATE), //split T
          ReportDate: moment(reportedDate).format(moment.HTML5_FMT.DATE), //split T
          StartDate: moment(Startbydate).format(moment.HTML5_FMT.DATE), //split T
          ResolveDate: moment(Completebydate).format(moment.HTML5_FMT.DATE), //split T
          TicketType: type == true ? TicketType.repeated : TicketType.new,
          TicketStatus: TicketStatus.NotStarted, //
          IsChargeable: isChargable,
          NoChargesReason: Reason.label,
          IsActive: true,
          CreatedDate: moment(new Date()).format(),
          CreatedBy: context.EmployeeId, //
        };
        await submitApiCall(requestObject);
        hideLoader();
      }
    }
    if (action === "reset") {
      setFormErrors({});
      setEngagement({});
      showLoader();
      setFromDate(null);
      setToDate(null);
      setIncidentDate(null);
      setReportedDate(null);
      setTicket("");
      setPrevTicket("");
      setPrevTicketId("");
      setTicketTitle("");
      setDescription("");
      setPlannedHours("");
      setStartbydate(null);
      setCompletebydate(null);
      setAllocatedMandays("");
      setAssignedMandays("");
      setBalancedMandays("");
      setisChargable(false);
      setType(false);
      hideLoader();
    }
  };

  const submitApiCall = async (submitObj: any) => {
    const { data } = await APICall(InsertUpdateTicketData, "POST", submitObj);
    if (data && data > 0) {
      navigate(`${env}/TicketDashboard`, { state: "false" });
      notify(0, "Ticket inserted successfully");
    } else {
      notify(1, "Ticket insertion fail");
    }
  };

  const assignedToApiCall = async (engagementId: any) => {
    let postObject = {
      searchFor: "assignedTo",
      searchValue: engagementId,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data != undefined || data != null) {
      let assignedToArray = [];
      await data.map((assignedTo: any) => {
        let tempObj = {
          eid: assignedTo.id,
          value: assignedTo.id,
          label: assignedTo.name,
        };
        assignedToArray.push(tempObj);
      });
      assignedToArray.sort((a, b) => a.label.localeCompare(b.label));
      setAssignedToOptions(assignedToArray);
    }
  };

  const CommonDropdownFunction = async (searchFor, searchValue) => {
    let postObject = {
      searchFor: searchFor,
      searchValue: searchValue,
    };

    const { data } = await APICall(GetDropDownList, "POST", postObject);

    return data;
  };

  const engagementApiCall = async () => {
    let EmployeeId = context.EmployeeId; //hardcoded

    var data;
    if (RoleId.includes("3")) {
      data = await CommonDropdownFunction(
        "engagementForManagerTicket",
        EmployeeId
      );
    } else {
      data = await CommonDropdownFunction("engagement", EmployeeId);
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
            label: `${engagement.engagement}-${engagement.application}`,
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
    // let customerId = 7; //hardcoded
    // let postObject = {
    //   searchFor: "engagement",
    //   searchValue: customerId,
    // };
    // const { data } = await APICall(GetDropDownList, "POST", postObject);
    // if (data != undefined || data != null) {
    //   let engagementArray = [];
    //   await data.map((engagement) => {
    //     let tempObj = {
    //       phasevalue: engagement.phaseId,
    //       label: ` ${engagement.engagement}-${engagement.phase}`,
    //       value: engagement.engagementId,
    //       empId: engagement.employeeId,
    //     };
    //     engagementArray.push(tempObj);
    //   });
    //   setEngagementOptions(engagementArray);
    // }
  };

  const onLoadAPI = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const type = urlParams.get("type");
    if (type == "adhoc") {
      setIsAdHoc(true);
    } else {
      setIsAdHoc(false);
    }
    await engagementApiCall();
  };

  useEffect(() => {
    onLoadAPI();
  }, [location]);

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "Engagement") {
      await setEngagement(event);
      if (event && Object.keys(event).length > 0) {
        assignedToApiCall(event.engagementId);

        //Reasons Dropdown
        var reason = await CommonDropdownFunction(
          "reason",
          event.engagementType
        );
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

        //    getCapacityEngagementByIdApiCall(event.value)
        setFormErrors((preState) => ({
          ...preState,
          ["Engagement_isEmpty"]: undefined,
        }));
        formErrorObj["Engagement_isEmpty"] = undefined;
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["Engagement_isEmpty"]: "Engagement can not be empty",
        }));
        formErrorObj["Engagement_isEmpty"] = "Engagement can not be empty";
      }
    }
    if (apiFieldName === "AssignedTo" && !isAdhoc) {
      setAssignedTo(event);
      if (event && Object.keys(event).length > 0) {
        //assignedToApiCall(event.value);
        setFormErrors((preState) => ({
          ...preState,
          ["AssignedTo_isEmpty"]: undefined,
        }));
        formErrorObj["AssignedTo_isEmpty"] = undefined;
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["AssignedTo_isEmpty"]: "Assigned to can not be empty",
        }));
        formErrorObj["AssignedTo_isEmpty"] = "Assigned to can not be empty";
      }
    }
    if (apiFieldName === "Reason") {
      setReason(event);
      if (event && Object.keys(event).length > 0) {
        // assignedToApiCall(event.value);
        setFormErrors((preState) => ({
          ...preState,
          ["Reason_isEmpty"]: undefined,
        }));
        formErrorObj["Reason_isEmpty"] = undefined;
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["Reason_isEmpty"]: "Reason can not be empty",
        }));
        formErrorObj["Reason_isEmpty"] = "Reason can not be empty";
      }
    }
    if (apiFieldName === "priority") {
      setPriority(event);
      if (event && Object.keys(event).length > 0) {
        assignedToApiCall(event.value);
        setFormErrors((preState) => ({
          ...preState,
          ["priority_isEmpty"]: undefined,
        }));
        formErrorObj["priority_isEmpty"] = undefined;
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["priority_isEmpty"]: "Priority can not be empty",
        }));
        formErrorObj["priority_isEmpty"] = "Priority can not be empty";
      }
    }
  };

  useEffect(() => {
    setPriority(priorityOptions[2]);
  }, []);

  return (
    <div>
      <section className="bg_breadcrumb">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h4>Ticket Assignment</h4>
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
                  Engagement / Application/ Phase<sup>*</sup>
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
                <p style={{ color: "red" }}>
                  {formErrors["Engagement_isEmpty"]}
                </p>
              </div>
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
                    <p style={{ color: "red" }}>
                      {formErrors["fromDate_isEmpty"]}
                    </p>
                  </div>
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
                    <p style={{ color: "red" }}>
                      {formErrors["toDate_isEmpty"]}
                    </p>
                  </div>
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
                      className="numRight"
                      type="number"
                      onKeyPress={(event) => {
                        if (!/^[0-9]*?$/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <p style={{ color: "red" }}>
                      {formErrors["allocatedMandays_isEmpty"]}
                    </p>
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
                      className="numRight"
                      type="number"
                      onKeyPress={(event) => {
                        if (!/^[0-9]*?$/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <p style={{ color: "red" }}>
                      {formErrors["assignedMandays_isEmpty"]}
                    </p>
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
                      className="numRight"
                      type="number"
                      onKeyPress={(event) => {
                        if (!/^[0-9]*?$/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <p style={{ color: "red" }}>
                      {formErrors["balancedMandays_isEmpty"]}
                    </p>
                  </div>
                </div>
              </>
            ) : null}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Ticket Title<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={ticketTitle}
                  onChange={(e) => handleTextEvent(e, "ticketTitle")}
                />
                <p style={{ color: "red" }}>
                  {formErrors["ticketTitle_isEmpty"]}
                </p>
              </div>
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
                      handleCheckEvent(e.target.checked, "isChargable")
                    }
                    checked={isChargable}
                  />
                </Form>
                <label style={{ float: "left" }}>Yes</label>
              </div>
            </div>
            {isChargable === false ? (
              <>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      Reason, if not chargeable<sup>*</sup>
                    </label>
                    <SelectForm
                      key={1}
                      options={ReasonOptions}
                      placeholder="Select"
                      isDisabled={false}
                      value={Reason}
                      onChange={(event) => selectOnChange(event, "Reason")}
                      isMulti={false}
                      noIndicator={false}
                      noSeparator={false}
                    />
                    <p style={{ color: "red" }}>
                      {formErrors["Reason_isEmpty"]}
                    </p>
                  </div>
                </div>
              </>
            ) : null}
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <Form.Label>Priority</Form.Label>
                  <SelectForm
                    key={1}
                    options={priorityOptions}
                    placeholder="Select"
                    isDisabled={false}
                    value={priority}
                    onChange={(event) => selectOnChange(event, "priority")}
                    isMulti={false}
                    noIndicator={false}
                    noSeparator={false}
                  />
                  <p style={{ color: "red" }}>
                    {formErrors["priority_isEmpty"]}
                  </p>
                </div>
              </div>
              {!isAdhoc ? (
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      Assigned to<sup>*</sup>
                    </label>
                    <SelectForm
                      key={1}
                      options={assignedToOptions}
                      placeholder="Select"
                      isDisabled={false}
                      value={AssignedTo}
                      onChange={(event) => selectOnChange(event, "AssignedTo")}
                      isMulti={false}
                      noIndicator={false}
                      noSeparator={false}
                    />
                    <p style={{ color: "red" }}>
                      {formErrors["AssignedTo_isEmpty"]}
                    </p>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <Form.Label>
                    Planned Hours<sup>*</sup>
                  </Form.Label>
                  <InputForm
                    placeholder={""}
                    isDisabled={false}
                    textArea={false}
                    value={PlannedHours}
                    onChange={(e) => handleTextEvent(e, "PlannedHours")}
                    className="numRight"
                    type="number"
                    onKeyPress={(event) => {
                      if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {formErrors["PlannedHours_isEmpty"]}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Ticket Description<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={true}
                  value={Description}
                  rows={4}
                  onChange={(e) => handleTextEvent(e, "Description")}
                />
                <p style={{ color: "red" }}>
                  {formErrors["Description_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="form-group">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Incident date"
                      value={incidentDate}
                      onChange={(e) => handleTextEvent(e, "incidentDate")}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                        <TextField size="small" required {...params} />
                      )}
                    />
                  </LocalizationProvider>
                  <p style={{ color: "red" }}>
                    {formErrors["incidentDate_isEmpty"]}
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="form-group">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Reported date"
                      value={reportedDate}
                      onChange={(e) => handleTextEvent(e, "reportedDate")}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                        <TextField size="small" required {...params} />
                      )}
                      minDate={incidentDate}
                    />
                  </LocalizationProvider>
                  <p style={{ color: "red" }}>
                    {formErrors["reportedDate_isEmpty"]}
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6">
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
                      minDate={reportedDate}
                    />
                  </LocalizationProvider>
                  <p style={{ color: "red" }}>
                    {formErrors["Startbydate_isEmpty"]}
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="form-group">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Resolve by date"
                      value={Completebydate}
                      onChange={(e) => handleTextEvent(e, "Completebydate")}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                        <TextField size="small" required {...params} />
                      )}
                      minDate={Startbydate}
                    />
                  </LocalizationProvider>
                  <p style={{ color: "red" }}>
                    {formErrors["Completebydate_isEmpty"]}
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Type</label>
                <br />
                <label style={{ float: "left" }}>First Time</label>
                <Form style={{ float: "left" }}>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label=""
                    onChange={(e) => handleCheckEvent(e.target.checked, "type")}
                  />
                </Form>
                <label style={{ float: "left" }}>Repeat</label>
              </div>
            </div> */}
            {type === true ? (
              <>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Previous Ticket ID, If Repeat</label>
                    <InputForm
                      placeholder={""}
                      isDisabled={false}
                      textArea={false}
                      value={prevTicketId}
                      onChange={(e) => handleTextEvent(e, "prevTicketId")}
                    />
                    <p style={{ color: "red" }}>
                      {formErrors["prevTicketId_isEmpty"]}
                    </p>
                  </div>
                </div>
                <div className="col-lg-8 col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Previous Ticket</label>
                    <InputForm
                      placeholder={""}
                      isDisabled={true}
                      textArea={true}
                      value={prevTicket}
                      onChange={(e) => handleTextEvent(e, "prevTicket")}
                    />
                    <p style={{ color: "red" }}>
                      {formErrors["prevTicket_isEmpty"]}
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="float-right">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default TicketAssignment;
