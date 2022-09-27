import React, { useEffect, useState } from "react";
import InputForm from "../../Components/InputForm/InputForm";
import SelectForm from "../../Components/SelectForm/SelectForm";
import "react-datepicker/dist/react-datepicker.css";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { useNavigate, useLocation } from "react-router-dom";
import { APICall } from "../../Helpers/API/APICalls";
import {
  getCapacityAllocationGridData,
  GetDropDownList,
  getCapacityAllocationById,
  insertUpdateCapacityAllocation,
  getCapacityAllocationDataByEngagement,
  getAllocatedResourcePerMonthApiCall,
  getAllocatedMandaysPerMonthApiCall,
  getTotalAllocatedMandaysApiCall,
  getTotalResourceAllocationApiCall,
} from "../../Helpers/API/APIEndPoints";
import { enagagementTypeOptions } from "../../Common/CommonJson";
import DynamicGrid from "../../Components/DynamicGrid/DynamicGrid";
import { getContext } from "../../Helpers/Context/Context";
import notify from "../../Helpers/ToastNotification";
import moment from "moment";
import uuid from "react-uuid";
import { Button, Modal } from "react-bootstrap";

const CapacityAllocation = (props: any) => {
  // let navigate = useNavigate();
  // let location = useLocation();
  const [engagement, setEngagement] = useState<any>({});
  const [engagementOptions, setEngagementOptions] = useState<any>([]);
  const [resourceAllocatedOptions, setResourceAllocatedOptions] = useState<any>(
    []
  );
  // const [
  //   engagementLeadsManagersOptions,
  //   setEngagementLeadsManagersOptions,
  // ] = useState<any>([]);
  const [capacityAllocationGridData, setCapacityAllocationGridData] = useState<
    any
  >([]);
  const [typeofEngagement, setTypeofEngagement] = useState<any>("");
  const [poResourcesPerMonth, setPoResourcesPerMonth] = useState("");
  const [budgetResourcesPerMonth, setBudgetResourcesPerMonth] = useState("");
  const [allocatedResourcesPerMonth, setAllocatedResourcesPerMonth] = useState(
    ""
  );
  const [poMandaysPerMonth, setPoMandaysPerMonth] = useState("");
  const [budgetMandaysPerMonth, setBudgetMandaysPerMonth] = useState("");
  const [allocatedMandaysPerMonth, setAllocatedMandaysPerMonth] = useState("");
  const [poMandays, setPoMandays] = useState("");
  const [budgetMandays, setBudgetMandays] = useState("");
  const [balanceMandays, setBalanceMandays] = useState("");
  const [spentMandays, setSpentMandays] = useState("");
  const [poCompletionDate, setPoCompletionDate] = useState<Date | null>(null);
  const [
    plannedCompletionDate,
    setPlannedCompletionDate,
  ] = useState<Date | null>(null);
  const [resourceAllocated, setResourceAllocated] = useState<any>({});
  // const [engagementLeadsManagers, setEngagementLeadsManagers] = useState<any>({});
  const [isEngagementLead, setIsEngagementLead] = useState(false);
  const [fractionAllocated, setFractionAllocated] = useState<any>("");
  const [totalResourceAllocation, setTotalResourceAllocation] = useState<any>(
    ""
  );
  const [mandaysAllocated, setMandaysAllocated] = useState<any>("");
  const [totalMandaysAllocated, setTotalMandaysAllocated] = useState<any>("");
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);
  const [formError, setFormError] = useState({});
  const context = getContext();
  const [submitId, setSubmitId] = useState(0);
  let formErrorObj = {};
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [toDate, setToDate] = React.useState<Date | null>(lastDay);
  const [fromDate, setFromDate] = React.useState<Date | null>(firstDay);
  const [enagagementTypeOptionsArr, setEnagagementTypeOptionsArr] = useState(
    enagagementTypeOptions
  );
  const [showAlert, setShowAlert] = useState(false);

  const capacityAllocationGridDataColumns = [
    {
      name: "id",
      label: "Id",
      options: {
        display: false,
      },
    },
    {
      name: "employeeName",
      label: "Resource Allocated",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "fromDate",
      label: "From Date",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta) => {
          if (value) {
            return moment(value).format(moment.HTML5_FMT.DATE);
          } else {
            return "";
          }
        },
      },
    },
    {
      name: "toDate",
      label: "To Date",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta) => {
          if (value) {
            return moment(value).format(moment.HTML5_FMT.DATE);
          } else {
            return "";
          }
        },
      },
    },
    {
      name: "mandays",
      label: "Mandays",
      options: {
        display:
          props.type === "PROJECT" ||
          props.type === "AMC" ||
          props.type === "T&M"
            ? true
            : false,
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    // {
    //   name: "fractionAllocated",
    //   label: "Fraction",
    //   options: {
    //     display: props.type === "T&M" ? true : false,
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "isActive",
    //   label: "Active",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     customBodyRender: (value, tableMeta) => {
    //       if (value) {
    //         return <i className="fas fa-check"></i>;
    //       } else {
    //         return <i className="fas fa-times"></i>;
    //       }
    //     },
    //   },
    // },
    {
      name: "",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          let id = tableMeta.tableData[tableMeta.rowIndex].id;
          return (
            <>
              {/* <a
                onClick={ (e) => {
                  e.preventDefault(); 
                  // navigate("edit", { state: id });
                   getCapacityAllocationByIdApiCall(id)

                }}> */}
              <a onClick={() => getCapacityAllocationByIdApiCall(id)}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </a>
            </>
          );
        },
      },
    },
  ];

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "engagement") {
      setEngagement(event);
      if (event && Object.keys(event).length > 0) {
        await getCapacityEngagementByIdApiCall(event.engagementId);
        await getCapacityAllocationGridDataApiCall(
          "engagement",
          event.engagementId
        );
        await getAllocatedResourcePerMonth("engagement", event.engagementId);
        await getAllocatedMandaysPerMonth("engagement", event.engagementId);
      } else if (!event || Object.keys(event).length === 0) {
        setFormError((preState) => ({
          ...preState,
          ["engagement_isEmpty"]: "Engagement can not be empty",
        }));
        formErrorObj["engagement_isEmpty"] = "Engagement can not be empty";
      }
    }
    if (apiFieldName === "typeofEngagement") {
      setEngagement({});
      setTypeofEngagement(event);
      if (event && Object.keys(event).length > 0) {
        await capacityEngagementApiCall(event.value);
      } else if (!event || Object.keys(event).length === 0) {
        setFormError((preState) => ({
          ...preState,
          ["typeofEngagement_isEmpty"]: "Engagement type can not be empty",
        }));
        formErrorObj["typeofEngagement_isEmpty"] =
          "Engagement type can not be empty";
      }
    }
    // if (apiFieldName === "engagementLeadsManagers") {
    //   setEngagementLeadsManagers(event);
    //   if (event && Object.keys(event).length > 0) {
    //   } else if (!event || Object.keys(event).length === 0) {
    //     setFormError((preState) => ({
    //       ...preState,
    //       ["engagementLeadsManagers_isEmpty"]: "Engagement Leads/Managers can not be empty",
    //     }));
    //     formErrorObj["engagementLeadsManagers_isEmpty"] = "Engagement Leads/Managers can not be empty"
    //   }
    // }
    if (apiFieldName === "resourceAllocated") {
      setResourceAllocated(event);
      await getTotalAllocatedMandays("resourceAllocated", event.value);
      await getTotalResourceAllocation("resourceAllocated", event.value);
      if (event && Object.keys(event).length > 0) {
      } else if (!event || Object.keys(event).length === 0) {
        setFormError((preState) => ({
          ...preState,
          ["resourceAllocated_isEmpty"]: "Resource allocated can not be empty",
        }));
        formErrorObj["resourceAllocated_isEmpty"] =
          "Resource allocated can not be empty";
      }
    }
  };

  const handleTextEvent = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "poResourcesPerMonth") {
      setPoResourcesPerMonth(event.target.value); //disabled
    }
    if (apiFieldName === "budgetResourcesPerMonth") {
      setBudgetResourcesPerMonth(event.target.value); //disabled
    }
    if (apiFieldName === "allocatedResourcesPerMonth") {
      setAllocatedResourcesPerMonth(event.target.value); //disabled
    }
    if (apiFieldName === "poMandaysPerMonth") {
      setPoMandaysPerMonth(event.target.value); //disabled
    }
    if (apiFieldName === "budgetMandaysPerMonth") {
      setBudgetMandaysPerMonth(event.target.value); //disabled
    }
    if (apiFieldName === "allocatedMandaysPerMonth") {
      setAllocatedMandaysPerMonth(event.target.value); //disabled
    }
    if (apiFieldName === "poMandays") {
      setPoMandays(event.target.value); //disabled
    }
    if (apiFieldName === "budgetMandays") {
      setBudgetMandays(event.target.value); //disabled
    }
    if (apiFieldName === "spentMandays") {
      setSpentMandays(event.target.value); //disabled
    }
    if (apiFieldName === "balancedMandays") {
      setBalanceMandays(event.target.value); //disabled
    }
    if (apiFieldName === "poCompletionDate") {
      setPoCompletionDate(event); //disabled
    }
    if (apiFieldName === "plannedCompletionDate") {
      setPlannedCompletionDate(event); //disabled
    }
    if (apiFieldName === "fromDate") {
      if (event) {
        await getCapacityAllocationGridDataApiCall("fromDate", new Date(event));
        await getAllocatedResourcePerMonth("fromDate", new Date(event));
        await getAllocatedMandaysPerMonth("fromDate", new Date(event));
        await getTotalAllocatedMandays("fromDate", new Date(event));
        await getTotalResourceAllocation("fromDate", new Date(event));
        setFromDate(event);
        setFormError((preState) => ({
          ...preState,
          ["fromDate_isEmpty"]: undefined,
        }));
        formErrorObj["fromDate_isEmpty"] = undefined;
      } else {
        await getCapacityAllocationGridDataApiCall(
          "fromDate",
          new Date(fromDate)
        );
        await getAllocatedResourcePerMonth("fromDate", new Date(fromDate));
        await getAllocatedMandaysPerMonth("fromDate", new Date(fromDate));
        await getTotalAllocatedMandays("fromDate", new Date(fromDate));
        await getTotalResourceAllocation("fromDate", new Date(fromDate));
        setFromDate(fromDate);
        setFormError((preState) => ({
          ...preState,
          ["fromDate_isEmpty"]: "From date can not be empty",
        }));
        formErrorObj["fromDate_isEmpty"] = "From date can not be empty";
      }
    }
    if (apiFieldName === "toDate") {
      if (event) {
        await getCapacityAllocationGridDataApiCall("toDate", new Date(event));
        await getAllocatedResourcePerMonth("toDate", new Date(event));
        await getAllocatedMandaysPerMonth("toDate", new Date(event));
        await getTotalAllocatedMandays("toDate", new Date(event));
        await getTotalResourceAllocation("toDate", new Date(event));
        setToDate(event);
        setFormError((preState) => ({
          ...preState,
          ["toDate_isEmpty"]: undefined,
        }));
        formErrorObj["toDate_isEmpty"] = undefined;
      } else {
        await getCapacityAllocationGridDataApiCall("toDate", new Date(toDate));
        await getAllocatedResourcePerMonth("toDate", new Date(toDate));
        await getAllocatedMandaysPerMonth("toDate", new Date(toDate));
        await getTotalAllocatedMandays("toDate", new Date(toDate));
        await getTotalResourceAllocation("toDate", new Date(toDate));
        setToDate(toDate);
        setFormError((preState) => ({
          ...preState,
          ["toDate_isEmpty"]: "To date can not be empty",
        }));
        formErrorObj["toDate_isEmpty"] = "To date can not be empty";
      }
    }
    if (apiFieldName === "fractionAllocated") {
      setFractionAllocated(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormError((preState) => ({
          ...preState,
          ["fractionAllocated_isEmpty"]: undefined,
        }));
        formErrorObj["fractionAllocated_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormError((preState) => ({
          ...preState,
          ["fractionAllocated_isEmpty"]: "Fraction allocated can not be empty",
        }));
        formErrorObj["fractionAllocated_isEmpty"] =
          "Fraction allocated can not be empty";
      }
    }
    if (apiFieldName === "totalResourceAllocation") {
      setTotalResourceAllocation(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormError((preState) => ({
          ...preState,
          ["totalResourceAllocation_isEmpty"]: undefined,
        }));
        formErrorObj["totalResourceAllocation_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormError((preState) => ({
          ...preState,
          ["totalResourceAllocation_isEmpty"]:
            "Total resource allocation can not be empty",
        }));
        formErrorObj["totalResourceAllocation_isEmpty"] =
          "Total resource allocation can not be empty";
      }
    }
    if (apiFieldName === "mandaysAllocated") {
      setMandaysAllocated(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormError((preState) => ({
          ...preState,
          ["mandaysAllocated_isEmpty"]: undefined,
        }));
        formErrorObj["mandaysAllocated_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormError((preState) => ({
          ...preState,
          ["mandaysAllocated_isEmpty"]: "Mandays allocated can not be empty",
        }));
        formErrorObj["mandaysAllocated_isEmpty"] =
          "Mandays allocated can not be empty";
      }
    }
    if (apiFieldName === "totalMandaysAllocated") {
      setTotalMandaysAllocated(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormError((preState) => ({
          ...preState,
          ["totalMandaysAllocated_isEmpty"]: undefined,
        }));
        formErrorObj["totalMandaysAllocated_isEmpty"] = undefined;
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormError((preState) => ({
          ...preState,
          ["totalMandaysAllocated_isEmpty"]:
            "Total mandays allocated can not be empty",
        }));
        formErrorObj["totalMandaysAllocated_isEmpty"] =
          "Total mandays allocated can not be empty";
      }
    }
  };

  const modelClose = (id: any) => {
    if (id === "cancel") {
      setShowAlert(false);
    } else if (id === "ok") {
      submitFunc("submit");
      setShowAlert(false);
    }
  };

  const resetFunc = () => {
    setFormError({});
    if (props.type === "AMC") {
      setCapacityAllocationGridData([]);
      setEngagement({});
      // setTypeofEngagement({});
      // setEngagementLeadsManagers({})
      setPoMandaysPerMonth("");
      setResourceAllocated({});
      setBudgetMandaysPerMonth("");
      setAllocatedMandaysPerMonth("");
      setMandaysAllocated("");
      setTotalMandaysAllocated("");
      setIsEngagementLead(false);
      setFromDate(firstDay);
      setToDate(lastDay);
    }
    if (props.type === "PROJECT") {
      setCapacityAllocationGridData([]);
      setEngagement({});
      // setTypeofEngagement({});
      // setEngagementLeadsManagers({})
      setPoMandays("");
      setBudgetMandays("");
      setSpentMandays("");
      setBalanceMandays("");
      setPoCompletionDate(null);
      setPlannedCompletionDate(null);
      setIsEngagementLead(false);
      setResourceAllocated({});
      setMandaysAllocated("");
      setFromDate(firstDay);
      setToDate(lastDay);
    }
    if (props.type === "T&M") {
      setCapacityAllocationGridData([]);
      setEngagement({});
      // setTypeofEngagement({});
      // setEngagementLeadsManagers({})
      setPoResourcesPerMonth("");
      setBudgetResourcesPerMonth("");
      setAllocatedResourcesPerMonth("");
      setIsEngagementLead(false);
      setTotalResourceAllocation("");
      setTotalMandaysAllocated("");
      setFractionAllocated("");
      setResourceAllocated({});
      setFromDate(firstDay);
      setToDate(lastDay);
    }
  };

  const submitApiCall = async (submitObj: any) => {
    const { data } = await APICall(
      insertUpdateCapacityAllocation,
      "POST",
      submitObj
    );
    if (data && data > 0) {
      // await getCapacityAllocationGridDataApiCall(submitObj.engagementId)
      if (props.type === "AMC") {
        setPoMandaysPerMonth("");
        setResourceAllocated({});
        setBudgetMandaysPerMonth("");
        setAllocatedMandaysPerMonth("");
        setMandaysAllocated("");
        setTotalMandaysAllocated("");
        setIsEngagementLead(false);
        setFromDate(firstDay);
        setToDate(lastDay);
      }
      if (props.type === "PROJECT") {
        setPoMandays("");
        setBudgetMandays("");
        setSpentMandays("");
        setBalanceMandays("");
        setPoCompletionDate(null);
        setPlannedCompletionDate(null);
        setIsEngagementLead(false);
        setResourceAllocated({});
        setMandaysAllocated("");
        setTotalMandaysAllocated("");
        // setEngagement({});
        // setTypeofEngagement({});
        // setCapacityAllocationGridData([]);
        setFromDate(firstDay);
        setToDate(lastDay);
      }
      if (props.type === "T&M") {
        setPoMandaysPerMonth("");
        setResourceAllocated({});
        setBudgetMandaysPerMonth("");
        setAllocatedMandaysPerMonth("");
        setMandaysAllocated("");
        setTotalMandaysAllocated("");
        setIsEngagementLead(false);
        setFromDate(firstDay);
        setToDate(lastDay);
      }
      if (
        engagement &&
        engagement.engagementId &&
        firstDay &&
        lastDay &&
        props.type === "AMC"
      ) {
        await getAllocatedMandaysPerMonthEdit(
          engagement.engagementId,
          moment(firstDay).format(moment.HTML5_FMT.DATE),
          moment(lastDay).format(moment.HTML5_FMT.DATE)
        );
      }
      if (
        engagement &&
        engagement.engagementId &&
        firstDay &&
        lastDay &&
        props.type === "T&M"
      ) {
        await getAllocatedResourcesPerMonthEdit(
          engagement.engagementId,
          moment(firstDay).format(moment.HTML5_FMT.DATE),
          moment(lastDay).format(moment.HTML5_FMT.DATE)
        );
      }
      if (
        engagement &&
        engagement.engagementId &&
        firstDay &&
        lastDay &&
        props.type === "PROJECT"
      ) {
        await getAllocatedMandaysPerMonthEdit(
          engagement.engagementId,
          moment(firstDay).format(moment.HTML5_FMT.DATE),
          moment(lastDay).format(moment.HTML5_FMT.DATE)
        );
      }
      await getCapacityEngagementByIdApiCall(engagement.engagementId);
      await getCapacityAllocationGridDataApiCallAfterSubmit(
        engagement.engagementId,
        firstDay,
        lastDay
      );
      await onLoadFunCall();
      if (submitId) {
        setSubmitId(0);
        notify(0, "Capacity allocation updated successfully");
      } else {
        setSubmitId(0);
        notify(0, "Capacity allocation inserted successfully");
      }
    } else {
      if (submitId) {
        notify(1, "Capacity allocation updation fail");
      } else {
        setSubmitId(0);
        notify(1, "Capacity allocation insertion fail");
      }
    }
  };

  const getCapacityAllocationGridDataApiCallAfterSubmit = async (
    engagementIdAfterSave: any,
    firstDayFromDate: any,
    lastDayFromDate: any
  ) => {
    let post = {};
    if (
      engagementIdAfterSave &&
      engagementIdAfterSave !== 0 &&
      firstDayFromDate &&
      lastDayFromDate
    ) {
      post = {
        EngagementId: engagementIdAfterSave,
        FromDate: moment(new Date(firstDayFromDate)).format(
          moment.HTML5_FMT.DATE
        ),
        ToDate: moment(new Date(lastDayFromDate)).format(moment.HTML5_FMT.DATE),
      };
    }
    const { data } = await APICall(getCapacityAllocationGridData, "POST", post);
    if (data) {
      setCapacityAllocationGridData(data);
    }
  };

  const onSubmitValidation = () => {
    formErrorObj = {};
    if (!fromDate) {
      formErrorObj["fromDate_isEmpty"] = "From date can not be empty";
    }
    if (!toDate) {
      formErrorObj["toDate_isEmpty"] = "To date can not be empty";
    }
    if (!engagement || Object.keys(engagement).length === 0) {
      formErrorObj["engagement_isEmpty"] = "Engagement can not be empty";
    }
    if (!typeofEngagement || Object.keys(typeofEngagement).length === 0) {
      formErrorObj["typeofEngagement_isEmpty"] =
        "Engagement type can not be empty";
    }
    // if (!engagementLeadsManagers || Object.keys(engagementLeadsManagers).length === 0) {
    //   formErrorObj["engagementLeadsManagers_isEmpty"] = "Engagement leads/managers can not be empty"
    // }
    if (!resourceAllocated || Object.keys(resourceAllocated).length === 0) {
      formErrorObj["resourceAllocated_isEmpty"] =
        "Resource allocated can not be empty";
    }
    // if (props.type === "T&M") {
    //   if (
    //     typeof fractionAllocated === "string" &&
    //     (!fractionAllocated || fractionAllocated.toString().trim() === "")
    //   ) {
    //     formErrorObj["fractionAllocated_isEmpty"] =
    //       "Fraction allocated can not be empty";
    //   } else if (fractionAllocated < 0 || fractionAllocated > 1) {
    //     formErrorObj["fractionAllocated_isEmpty"] =
    //       "Fraction allocated can not be greater than 1";
    //   } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(fractionAllocated)) {
    //     formErrorObj["fractionAllocated_isEmpty"] =
    //       "Fraction allocated should have maximum 2 decimals only";
    //   }
    // } else {
    //   if (
    //     (typeof mandaysAllocated === "string" &&
    //       (!mandaysAllocated || mandaysAllocated.toString().trim() === "")) ||
    //     (typeof mandaysAllocated === "number" && mandaysAllocated < 0)
    //   ) {
    //     formErrorObj["mandaysAllocated_isEmpty"] =
    //       "Mandays allocated can not be empty or negative";
    //   } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(mandaysAllocated)) {
    //     formErrorObj["mandaysAllocated_isEmpty"] =
    //       "Mandays allocated should have maximum 2 decimals only";
    //   }
    // }
    setFormError(formErrorObj);
  };

  const submitFunc = async (action: any) => {
    let submitObj: any = {};
    if (action === "submit") {
      submitObj = {
        engagementId: engagement.engagementId,
        fromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
        toDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        employeeId: resourceAllocated.value,
        fractionAllocated: Number(fractionAllocated), //fractionAllocated,
        mandays: Number(mandaysAllocated),
        isActive: true,
        isEngagementLead: isEngagementLead,
        createdBy: Number(context.EmployeeId),
      };
      if (submitId !== 0) {
        submitObj.Id = submitId;
      }
      await onSubmitValidation();
      let isEmpty = Object.values(formErrorObj).every((f) => {
        f === "" || f === null || f === undefined;
      });
      if (isEmpty === true) {
        await submitApiCall(submitObj);
      }
    }
    if (action === "reset") {
      resetFunc();
    }
  };

  const getCapacityEngagementByIdApiCall = async (engagementId: any) => {
    if (engagementId !== 0 && props.type && props.type !== "") {
      let post = {
        EngagementId: engagementId,
        EngagementType: props.type,
      };
      const { data } = await APICall(
        getCapacityAllocationDataByEngagement,
        "POST",
        post
      );
      if (data && Object.keys(data).length > 0 && props.type === "AMC") {
        setPoMandaysPerMonth(data.pomanDaysPerMonth);
        setBudgetMandaysPerMonth(data.budgetMandaysPerMonth);
      }
      if (data && Object.keys(data).length > 0 && props.type === "T&M") {
        setPoResourcesPerMonth(data.poresourcesPerMonth);
        setBudgetResourcesPerMonth(data.budgetResoucesPerMonth);
      }
      if (data && Object.keys(data).length > 0 && props.type === "PROJECT") {
        setPoMandays(data.pomanDays);
        setBudgetMandays(data.budgetMandays);
        setPoCompletionDate(new Date(data.pocompletionDate));
        setPlannedCompletionDate(new Date(data.plannedCompletionDate));
        setSpentMandays(data.spentMandates);
        setBalanceMandays(data.balanceMandays);
      }
    }
  };

  const getCapacityAllocationGridDataApiCall = async (
    field: any,
    value: any
  ) => {
    let post = {};
    if (field === "engagement" && fromDate && toDate && value) {
      post = {
        EngagementId: value,
        FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
        ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
      };
    } else if (
      field === "fromDate" &&
      engagement &&
      engagement.engagementId &&
      engagement.engagementId !== 0 &&
      toDate &&
      value
    ) {
      post = {
        EngagementId: engagement.engagementId,
        FromDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
        ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
      };
    } else if (
      field === "toDate" &&
      engagement &&
      engagement.engagementId &&
      engagement.engagementId !== 0 &&
      fromDate &&
      value
    ) {
      post = {
        EngagementId: engagement.engagementId,
        FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
        ToDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
      };
    } else if (
      field === "" &&
      engagement &&
      engagement.engagementId &&
      engagement.engagementId !== 0 &&
      fromDate &&
      toDate
    ) {
      post = {
        EngagementId: engagement.engagementId,
        FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
        ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
      };
    }
    const { data } = await APICall(getCapacityAllocationGridData, "POST", post);
    if (data) {
      setCapacityAllocationGridData(data);
    }
    // if (engagementId !== 0) {
    //   let requestParams = {
    //     EngagementId: engagementId,

    //     // start: start,
    //     // pageSize: pageSize,
    //     // sortColumn: sortColumn,
    //     // sortDirection: sortDirection,
    //     // searchText: searchText,
    //   };
    //   const { data } = await APICall(
    //     getCapacityAllocationGridData,
    //     "POST",
    //     requestParams
    //   );
    //   setCapacityAllocationGridData(data);
    //   // setCount(data.count);
    // }
  };

  const getAllocatedResourcesPerMonthEdit = async (
    engagementIdEdit: any,
    fromDateEdit: any,
    toDateEdit: any
  ) => {
    let post = {};
    if (engagementIdEdit !== 0 && fromDateEdit && toDateEdit) {
      post = {
        EngagementId: engagementIdEdit,
        FromDate: moment(fromDateEdit).format(moment.HTML5_FMT.DATE),
        ToDate: moment(toDateEdit).format(moment.HTML5_FMT.DATE),
      };
    }
    const { data } = await APICall(
      getAllocatedResourcePerMonthApiCall,
      "POST",
      post
    );
    if (data) {
      setAllocatedResourcesPerMonth(data.allocatedResourcePerMonth);
    }
  };

  const getAllocatedMandaysPerMonthEdit = async (
    engagementIdEdit: any,
    fromDateEdit: any,
    toDateEdit: any
  ) => {
    let post = {};
    if (engagementIdEdit !== 0 && fromDateEdit && toDateEdit) {
      post = {
        EngagementId: engagementIdEdit,
        FromDate: moment(fromDateEdit).format(moment.HTML5_FMT.DATE),
        ToDate: moment(toDateEdit).format(moment.HTML5_FMT.DATE),
      };
    }
    const { data } = await APICall(
      getAllocatedMandaysPerMonthApiCall,
      "POST",
      post
    );
    if (data && data.allocatedMandaysPerMonth) {
      setAllocatedMandaysPerMonth(data.allocatedMandaysPerMonth || 0);
    }
  };

  const getTotalMandaysAllocatedEdit = async (
    resourceAllocatedEdit: any,
    fromDateEdit: any,
    toDateEdit: any,
    allocatedMandaysEdit: any
  ) => {
    let post = {};
    if (
      resourceAllocatedEdit &&
      resourceAllocatedEdit !== 0 &&
      fromDateEdit &&
      toDateEdit
    ) {
      post = {
        EmployeeId: resourceAllocatedEdit,
        FromDate: moment(fromDateEdit).format(moment.HTML5_FMT.DATE),
        ToDate: moment(toDateEdit).format(moment.HTML5_FMT.DATE),
      };
    }
    const { data } = await APICall(
      getTotalAllocatedMandaysApiCall,
      "POST",
      post
    );
    if (data && data.totalAllocatedMandays) {
      if (
        data.totalAllocatedMandays &&
        data.totalAllocatedMandays !== "" &&
        Number(data.totalAllocatedMandays) >= 0 &&
        allocatedMandaysEdit &&
        allocatedMandaysEdit !== "" &&
        Number(allocatedMandaysEdit) >= 0
      ) {
        data.totalAllocatedMandays =
          Number(data.totalAllocatedMandays) - Number(allocatedMandaysEdit);
      }
      setTotalMandaysAllocated(data.totalAllocatedMandays);
    }
  };

  const getTotalResourceAllocationEdit = async (
    resourceAllocatedEdit: any,
    fromDateEdit: any,
    toDateEdit: any,
    allocatedFractionEdit: any
  ) => {
    let post = {};
    if (
      resourceAllocatedEdit &&
      resourceAllocatedEdit !== 0 &&
      fromDateEdit &&
      toDateEdit
    ) {
      post = {
        EmployeeId: resourceAllocatedEdit,
        FromDate: moment(fromDateEdit).format(moment.HTML5_FMT.DATE),
        ToDate: moment(toDateEdit).format(moment.HTML5_FMT.DATE),
      };
    }
    const { data } = await APICall(
      getTotalResourceAllocationApiCall,
      "POST",
      post
    );
    if (data && data.totalResourceAllocation) {
      if (
        data.totalResourceAllocation &&
        data.totalResourceAllocation !== "" &&
        Number(data.totalResourceAllocation) >= 0 &&
        allocatedFractionEdit &&
        allocatedFractionEdit !== "" &&
        Number(allocatedFractionEdit) >= 0
      ) {
        data.totalResourceAllocation =
          Number(data.totalResourceAllocation) - Number(allocatedFractionEdit);
      }
      setTotalResourceAllocation(data.totalResourceAllocation);
    }
  };

  const getCapacityAllocationByIdApiCall = async (Id: any) => {
    setFormError({});
    formErrorObj = {};
    if (Id !== 0) {
      let post = {
        id: Id,
      };
      const { data } = await APICall(getCapacityAllocationById, "POST", post);
      if (data && Object.keys(data).length > 0) {
        setSubmitId(data.id);
        setFromDate(data.fromDate);
        setToDate(data.toDate);
        setIsEngagementLead(data.isEngagementLead);
        await enagagementTypeOptions.map((ele) => {
          if (ele.value === Number(data.engagementType)) {
            setTypeofEngagement(ele);
          }
        });
        await engagementOptions.map(async (ele: any) => {
          if (ele.engagementId === data.engagementId) {
            setEngagement(ele);
          }
        });
        await resourceAllocatedOptions.map((ele: any) => {
          if (ele.value === data.employeeId) {
            setResourceAllocated(ele);
          }
        });
        await getCapacityEngagementByIdApiCall(data.engagementId);
        //await getCapacityAllocationGridDataApiCall(data.engagementId);
        await capacityEngagementApiCall(data.engagementType);
        if (data && Object.keys(data).length > 0 && props.type === "AMC") {
          setMandaysAllocated(data.mandays);
          await getAllocatedMandaysPerMonthEdit(
            data.engagementId,
            moment(data.fromDate).format(moment.HTML5_FMT.DATE),
            moment(data.toDate).format(moment.HTML5_FMT.DATE)
          );
          await getTotalMandaysAllocatedEdit(
            data.employeeId,
            moment(data.fromDate).format(moment.HTML5_FMT.DATE),
            moment(data.toDate).format(moment.HTML5_FMT.DATE),
            data.mandays
          );
        }
        if (data && Object.keys(data).length > 0 && props.type === "T&M") {
          setMandaysAllocated(data.mandays);
          await getAllocatedMandaysPerMonthEdit(
            data.engagementId,
            moment(data.fromDate).format(moment.HTML5_FMT.DATE),
            moment(data.toDate).format(moment.HTML5_FMT.DATE)
          );
          await getTotalMandaysAllocatedEdit(
            data.employeeId,
            moment(data.fromDate).format(moment.HTML5_FMT.DATE),
            moment(data.toDate).format(moment.HTML5_FMT.DATE),
            data.mandays
          );
        }
        if (data && Object.keys(data).length > 0 && props.type === "PROJECT") {
          setMandaysAllocated(data.mandays);
          await getAllocatedMandaysPerMonthEdit(
            data.engagementId,
            moment(data.fromDate).format(moment.HTML5_FMT.DATE),
            moment(data.toDate).format(moment.HTML5_FMT.DATE)
          );
          await getTotalMandaysAllocatedEdit(
            data.employeeId,
            moment(data.fromDate).format(moment.HTML5_FMT.DATE),
            moment(data.toDate).format(moment.HTML5_FMT.DATE),
            data.mandays
          );
        }
      }
      window.scrollTo(0, 0);
    }
  };

  const getAllocatedResourcePerMonth = async (field, value) => {
    if (typeofEngagement.label === "T&M") {
      let post;
      if (field === "engagement" && fromDate && toDate && value) {
        post = {
          EngagementId: value,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "fromDate" &&
        engagement &&
        engagement.engagementId &&
        engagement.engagementId !== 0 &&
        toDate &&
        value
      ) {
        post = {
          EngagementId: engagement.engagementId,
          FromDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "toDate" &&
        engagement &&
        engagement.engagementId &&
        engagement.engagementId !== 0 &&
        fromDate &&
        value
      ) {
        post = {
          EngagementId: engagement.engagementId,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "" &&
        engagement &&
        engagement.engagementId &&
        engagement.engagementId !== 0 &&
        fromDate &&
        toDate
      ) {
        post = {
          EngagementId: engagement.engagementId,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      }
      const { data } = await APICall(
        getAllocatedResourcePerMonthApiCall,
        "POST",
        post
      );
      if (data) {
        setAllocatedResourcesPerMonth(data.allocatedResourcePerMonth);
      }
    }
  };

  const getAllocatedMandaysPerMonth = async (field, value) => {
    if (typeofEngagement.label === "AMC") {
      let post;
      if (field === "engagement" && fromDate && toDate && value) {
        post = {
          EngagementId: value,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "fromDate" &&
        engagement &&
        engagement.engagementId &&
        engagement.engagementId !== 0 &&
        toDate &&
        value
      ) {
        post = {
          EngagementId: engagement.engagementId,
          FromDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "toDate" &&
        engagement &&
        engagement.engagementId &&
        engagement.engagementId !== 0 &&
        fromDate &&
        value
      ) {
        post = {
          EngagementId: engagement.engagementId,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "" &&
        engagement &&
        engagement.engagementId &&
        engagement.engagementId !== 0 &&
        fromDate &&
        toDate
      ) {
        post = {
          EngagementId: engagement.engagementId,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      }
      const { data } = await APICall(
        getAllocatedMandaysPerMonthApiCall,
        "POST",
        post
      );
      if (data && data.allocatedMandaysPerMonth) {
        setAllocatedMandaysPerMonth(data.allocatedMandaysPerMonth || 0);
      }
    }
  };

  const getTotalAllocatedMandays = async (field, value) => {
    if (
      typeofEngagement.label === "AMC" ||
      typeofEngagement.label === "PROJECT" ||
      typeofEngagement.label === "PRODUCT" ||
      typeofEngagement.label === "INTERNAL" ||
      typeofEngagement.label === "T&M"
    ) {
      let post;
      if (field === "resourceAllocated" && fromDate && toDate && value) {
        post = {
          EmployeeId: value,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "fromDate" &&
        resourceAllocated &&
        resourceAllocated.value &&
        resourceAllocated.value !== 0 &&
        toDate &&
        value
      ) {
        post = {
          EmployeeId: resourceAllocated.value,
          FromDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "toDate" &&
        resourceAllocated &&
        resourceAllocated.value &&
        resourceAllocated.value !== 0 &&
        fromDate &&
        value
      ) {
        post = {
          EmployeeId: resourceAllocated.value,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "" &&
        resourceAllocated &&
        resourceAllocated.value &&
        resourceAllocated.value !== 0 &&
        fromDate &&
        toDate
      ) {
        post = {
          EmployeeId: resourceAllocated.value,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      }
      const { data } = await APICall(
        getTotalAllocatedMandaysApiCall,
        "POST",
        post
      );
      if (data && data.totalAllocatedMandays) {
        setTotalMandaysAllocated(data.totalAllocatedMandays);
      }
    }
  };

  const getTotalResourceAllocation = async (field, value) => {
    if (typeofEngagement.label === "T&M") {
      let post;
      if (field === "resourceAllocated" && fromDate && toDate && value) {
        post = {
          EmployeeId: value,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "fromDate" &&
        resourceAllocated &&
        resourceAllocated.value &&
        resourceAllocated.value !== 0 &&
        toDate &&
        value
      ) {
        post = {
          EmployeeId: resourceAllocated.value,
          FromDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "toDate" &&
        resourceAllocated &&
        resourceAllocated.value &&
        resourceAllocated.value !== 0 &&
        fromDate &&
        value
      ) {
        post = {
          EmployeeId: resourceAllocated.value,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(new Date(value)).format(moment.HTML5_FMT.DATE),
        };
      } else if (
        field === "" &&
        resourceAllocated &&
        resourceAllocated.value &&
        resourceAllocated.value !== 0 &&
        fromDate &&
        toDate
      ) {
        post = {
          EmployeeId: resourceAllocated.value,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        };
      }
      const { data } = await APICall(
        getTotalResourceAllocationApiCall,
        "POST",
        post
      );
      if (data && data.totalResourceAllocation) {
        setTotalResourceAllocation(data.totalResourceAllocation);
      }
    }
  };

  const options = {
    selectableRows: "none",
    count: count,
    rowsPerPage: pageSize,
    serverSide: true,
    rowsPerPageOptions: [],
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    search: false,
    onChangeRowsPerPage: (num) => {},
    onSearchChange: (searchText) => {
      if (searchText !== null) {
        setSearchText(searchText);
      } else {
        setSearchText("");
      }
    },
    onColumnSortChange: async (sortColumn, sortDirection) => {
      if (sortDirection === "asc") {
        await setSortColumn(sortColumn);
        await setSortDirection(sortDirection);
      }
      if (sortDirection === "desc") {
        await setSortColumn(sortColumn);
        await setSortDirection(sortDirection);
      }
    },
    onChangePage: async (page) => {
      setStart(page * pageSize);
    },
  };

  // const engagementLeadsManagersApiCall = async () => {
  //   let postObject = {
  //     "searchFor": "engagementLeadsManagers",
  //     "searchValue": 1
  //   }
  //   const { data } = await APICall(GetDropDownList, "POST", postObject);
  //   if (data != undefined || data != null) {
  //     let engagementLeadsManagersArray = [];
  //     await data.map((engagementLeadsManager: any) => {
  //       let tempObj = {
  //         value: engagementLeadsManager.id,
  //         label: engagementLeadsManager.name
  //       }
  //       engagementLeadsManagersArray.push(tempObj);
  //     })
  //     setEngagementLeadsManagersOptions(engagementLeadsManagersArray);
  //   }
  // }

  const resourceApiCall = async () => {
    let postObject = {
      searchFor: "employee",
      searchValue: 1,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data != undefined || data != null) {
      let employeeArray = [];
      await data.map((employee: any) => {
        let tempObj = {
          value: employee.id,
          label: employee.name,
        };
        employeeArray.push(tempObj);
      });
      setResourceAllocatedOptions(employeeArray);
    }
  };

  const capacityEngagementApiCall = async (type: any) => {
    let postObject = {
      searchFor: "capacityEngagement",
      searchValue: type,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data) {
      let engagementArray = [];
      if (type > 0) {
        await data.map((engagement: any) => {
          let tempObj = {
            phasevalue: null,
            label: `${engagement.engagement}`,
            value: uuid(),
            engagementId: engagement.id,
          };
          engagementArray.push(tempObj);
        });
        engagementArray.sort((a, b) => a.label.localeCompare(b.label));
        setEngagementOptions(engagementArray);
      }
      // else {
      //   engagementArray = [];
      //   await data.map((engagement) => {
      //     let tempObj;
      //     if (engagement.phase != null) {
      //       tempObj = {
      //         phasevalue: engagement.phaseId,
      //         label: `${engagement.engagement}-${engagement.phase}`,
      //         value: uuid(),
      //         engagementId: engagement.engagementId,
      //         // empId: engagement.employeeId,
      //         // engagementType: engagement.engagementType,
      //       };
      //     } else if (engagement.application != null) {
      //       tempObj = {
      //         applicationValue: engagement.applicationId,
      //         label: ` ${engagement.engagement}-${engagement.application}`,
      //         value: uuid(),
      //         engagementId: engagement.engagementId,
      //         // empId: engagement.employeeId,
      //         // engagementType: engagement.engagementType,
      //       };
      //     } else {
      //       tempObj = {
      //         phasevalue: engagement.phaseId,
      //         label: `${engagement.engagement}`,
      //         value: uuid(),
      //         engagementId: engagement.engagementId,
      //         // empId: engagement.employeeId,
      //         // engagementType: engagement.engagementType,
      //       };
      //     }
      //     engagementArray.push(tempObj);
      //   });
      //   setEngagementOptions(engagementArray);
      // }
    }
  };

  const getEngagementTypeFuncCall = (type: any) => {
    if (type !== "PROJECT") {
      enagagementTypeOptions.map(async (ele: any) => {
        if (ele.label == type) {
          setTypeofEngagement(ele);
          await capacityEngagementApiCall(ele.value);
          // await engagementLeadsManagersApiCall()
        }
      });
      setEnagagementTypeOptionsArr(enagagementTypeOptions);
    } else {
      var newArray = enagagementTypeOptions.filter((el: any) => {
        return (
          el.label === "PROJECT" ||
          el.label === "PRODUCT" ||
          el.label === "INTERNAL"
        );
      });
      setEnagagementTypeOptionsArr(newArray);
    }
  };

  const onLoadFunCall = async () => {
    await getEngagementTypeFuncCall(props.type);
    // await capacityEngagementApiCall()
    await resourceApiCall();
  };

  useEffect(() => {
    if (props && props.type && props.type !== "") {
      onLoadFunCall();
    }
  }, [props]);

  return (
    <>
      <>
        <div>
          <section className="bg_breadcrumb">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <h4>
                    Capacity Allocation -{" "}
                    {props.type === "PROJECT"
                      ? "Project/Product/Internal"
                      : typeofEngagement.label}
                  </h4>
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
                      Type of Engagement<sup>*</sup>
                    </label>
                    <SelectForm
                      key={1}
                      options={enagagementTypeOptionsArr}
                      placeholder="Select"
                      isDisabled={props.type !== "PROJECT"}
                      value={typeofEngagement}
                      onChange={(event) =>
                        selectOnChange(event, "typeofEngagement")
                      }
                      isMulti={false}
                      noIndicator={false}
                      noSeparator={false}
                    />
                    <span style={{ color: "red" }}>
                      {formError["typeofEngagement_isEmpty"]}
                    </span>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="form-group">
                    {/* {props.type == "T&M" ? (
                      <>
                        <label>
                          Engagement<sup>*</sup>
                        </label>
                      </>
                    ) : (
                      <>
                        <label>
                          Engagement/Application/Phase<sup>*</sup>
                        </label>
                      </>
                    )} */}
                    <label>
                      Engagement<sup>*</sup>
                    </label>
                    <SelectForm
                      options={engagementOptions}
                      placeholder="Select"
                      isDisabled={false}
                      value={engagement}
                      onChange={(event) => selectOnChange(event, "engagement")}
                      isMulti={false}
                      noIndicator={false}
                      noSeparator={false}
                    />
                  </div>
                  <span style={{ color: "red" }}>
                    {formError["engagement_isEmpty"]}
                  </span>
                </div>
                {typeofEngagement.label === "T&M" ? (
                  <>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>PO Resources / month</label>
                        <InputForm
                          placeholder={"PO Resources / month"}
                          isDisabled={true}
                          textArea={false}
                          value={poResourcesPerMonth}
                          onChange={(e) =>
                            handleTextEvent(e, "poResourcesPerMonth")
                          }
                          className="numRight"
                          type="number"
                          onKeyPress={(event) => {
                            if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                        <span style={{ color: "red" }}>
                          {formError["poResourcesPerMonth_isEmpty"]}
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>Budget Resources/month</label>
                        <InputForm
                          placeholder={""}
                          isDisabled={true}
                          textArea={false}
                          value={budgetResourcesPerMonth}
                          onChange={(e) =>
                            handleTextEvent(e, "budgetResourcesPerMonth")
                          }
                          className="numRight"
                          type="number"
                          onKeyPress={(event) => {
                            if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                        <span style={{ color: "red" }}>
                          {formError["budgetResourcesPerMonth_isEmpty"]}
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>Allocated Resources / month</label>
                        <InputForm
                          placeholder={""}
                          isDisabled={true}
                          textArea={false}
                          value={allocatedResourcesPerMonth}
                          onChange={(e) =>
                            handleTextEvent(e, "allocatedResourcesPerMonth")
                          }
                          className="numRight"
                          type="number"
                          onKeyPress={(event) => {
                            if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                        <span style={{ color: "red" }}>
                          {formError["allocatedResourcesPerMonth_isEmpty"]}
                        </span>
                      </div>
                    </div>
                  </>
                ) : typeofEngagement.label === "AMC" ? (
                  <>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>PO Mandays / month</label>
                        <InputForm
                          placeholder={""}
                          isDisabled={true}
                          textArea={false}
                          value={poMandaysPerMonth}
                          onChange={(e) =>
                            handleTextEvent(e, "poMandaysPerMonth")
                          }
                          className="numRight"
                          type="number"
                          onKeyPress={(event) => {
                            if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                        <span style={{ color: "red" }}>
                          {formError["poMandaysPerMonth_isEmpty"]}
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>Budget Mandays/month</label>
                        <InputForm
                          placeholder={""}
                          isDisabled={true}
                          textArea={false}
                          value={budgetMandaysPerMonth}
                          onChange={(e) =>
                            handleTextEvent(e, "budgetMandaysPerMonth")
                          }
                          className="numRight"
                          type="number"
                          onKeyPress={(event) => {
                            if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                        <span style={{ color: "red" }}>
                          {formError["budgetMandaysPerMonth_isEmpty"]}
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>Allocated Mandays / month</label>
                        <InputForm
                          placeholder={""}
                          isDisabled={true}
                          textArea={false}
                          value={allocatedMandaysPerMonth}
                          onChange={(e) =>
                            handleTextEvent(e, "allocatedMandaysPerMonth")
                          }
                          className="numRight"
                          type="number"
                          onKeyPress={(event) => {
                            if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                        <span style={{ color: "red" }}>
                          {formError["allocatedMandaysPerMonth_isEmpty"]}
                        </span>
                      </div>
                    </div>
                  </>
                ) : typeofEngagement.label === "PROJECT" ||
                  typeofEngagement.label === "PRODUCT" ||
                  typeofEngagement.label === "INTERNAL" ? (
                  <>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>PO Mandays</label>
                        <InputForm
                          placeholder={""}
                          isDisabled={true}
                          textArea={false}
                          value={poMandays}
                          onChange={(e) => handleTextEvent(e, "poMandays")}
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
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>Budget Mandays</label>
                        <InputForm
                          placeholder={""}
                          isDisabled={true}
                          textArea={false}
                          value={budgetMandays}
                          onChange={(e) => handleTextEvent(e, "budgetMandays")}
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
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>Spent Mandays</label>
                        <InputForm
                          placeholder={""}
                          isDisabled={true}
                          textArea={false}
                          value={spentMandays}
                          onChange={(e) => handleTextEvent(e, "spentMandays")}
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
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>Balance Mandays</label>
                        <InputForm
                          placeholder={""}
                          isDisabled={true}
                          textArea={false}
                          value={balanceMandays}
                          onChange={(e) =>
                            handleTextEvent(e, "balancedMandays")
                          }
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
                    <div className="row">
                      <div className="col-lg-4 col-md-4 col-sm-6">
                        <div className="form-group">
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="PO Completion Date"
                              value={poCompletionDate}
                              onChange={(e) =>
                                handleTextEvent(e, "poCompletionDate")
                              }
                              inputFormat="dd/MM/yyyy"
                              renderInput={(params) => (
                                <TextField size="small" {...params} />
                              )}
                              disabled={true}
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-6">
                        <div className="form-group">
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="Planned Completion Date"
                              value={plannedCompletionDate}
                              onChange={(e) =>
                                handleTextEvent(e, "plannedCompletionDate")
                              }
                              inputFormat="dd/MM/yyyy"
                              renderInput={(params) => (
                                <TextField size="small" {...params} />
                              )}
                              disabled={true}
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                {/* <label>Engagement Lead(s) / Manager(s)</label>
                <SelectForm
                  options={engagementLeadsManagersOptions}
                  placeholder="Select"
                  isDisabled={false}
                  value={engagementLeadsManagers}
                  onChange={(event) =>
                    selectOnChange(event, "engagementLeadsManagers")
                  }
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false} />
                <span style={{ color: "red" }}>
                  {formError["engagementLeadsManagers_isEmpty"]}
                </span> */}
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="form-group">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="From date"
                          value={fromDate}
                          onChange={(e) => {
                            handleTextEvent(e, "fromDate");
                          }}
                          inputFormat="dd/MM/yyyy"
                          renderInput={(params) => (
                            <TextField size="small" required {...params} />
                          )}
                        />
                      </LocalizationProvider>
                      <span style={{ color: "red" }}>
                        {formError["fromDate_isEmpty"]}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="form-group">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="To date"
                          value={toDate}
                          onChange={(e) => handleTextEvent(e, "toDate")}
                          inputFormat="dd/MM/yyyy"
                          minDate={fromDate}
                          renderInput={(params) => (
                            <TextField required size="small" {...params} />
                          )}
                        />
                      </LocalizationProvider>
                      <span style={{ color: "red" }}>
                        {formError["toDate_isEmpty"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="form-group">
                      <label>
                        Resource Allocated<sup>*</sup>
                      </label>
                      <SelectForm
                        options={resourceAllocatedOptions}
                        placeholder="Select"
                        isDisabled={false}
                        value={resourceAllocated}
                        onChange={(event) =>
                          selectOnChange(event, "resourceAllocated")
                        }
                        isMulti={false}
                        noIndicator={false}
                        noSeparator={false}
                      />
                      <span style={{ color: "red" }}>
                        {formError["resourceAllocated_isEmpty"]}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4 col-sm-6 align-self-end">
                    <div className="form-group d-flex gap-3 align-items-center">
                      <label htmlFor="isEngagementLead">
                        Is Engagement Lead
                      </label>
                      <input
                        id="isEngagementLead"
                        type="checkbox"
                        onChange={(e) => setIsEngagementLead(e.target.checked)}
                        name="isEngagementLead"
                        checked={isEngagementLead}
                      />
                      <span style={{ color: "red" }}>
                        {formError["isEngagementLead_isEmpty"]}
                      </span>
                    </div>
                  </div>
                  {typeofEngagement.label === "T&M" ? (
                    // <>
                    //   <div className="col-lg-3 col-md-4 col-sm-6">
                    //     <div className="form-group">
                    //       <label>
                    //         Fraction Allocated<sup>*</sup>
                    //       </label>
                    //       <InputForm
                    //         placeholder={""}
                    //         isDisabled={false}
                    //         textArea={false}
                    //         value={fractionAllocated}
                    //         onChange={(e) =>
                    //           handleTextEvent(e, "fractionAllocated")
                    //         }
                    //         className="numRight"
                    //         type="number"
                    //         onKeyPress={(event) => {
                    //           if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                    //             event.preventDefault();
                    //           }
                    //         }}
                    //       />
                    //       <span style={{ color: "red" }}>
                    //         {formError["fractionAllocated_isEmpty"]}
                    //       </span>
                    //     </div>
                    //   </div>
                    //   <div className="col-lg-3 col-md-4 col-sm-6">
                    //     <div className="form-group">
                    //       <label>Total Resource Allocation</label>
                    //       <InputForm
                    //         placeholder={""}
                    //         isDisabled={true}
                    //         textArea={false}
                    //         value={totalResourceAllocation}
                    //         onChange={(e) =>
                    //           handleTextEvent(e, "totalResourceAllocation")
                    //         }
                    //         className="numRight"
                    //         type="number"
                    //         onKeyPress={(event) => {
                    //           if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                    //             event.preventDefault();
                    //           }
                    //         }}
                    //       />
                    //       <span style={{ color: "red" }}>
                    //         {formError["totalResourceAllocation_isEmpty"]}
                    //       </span>
                    //     </div>
                    //   </div>
                    // </>
                    <>
                      <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                          <label>
                            Mandays Allocated<sup>*</sup>
                          </label>
                          <InputForm
                            placeholder={""}
                            isDisabled={false}
                            textArea={false}
                            value={mandaysAllocated}
                            onChange={(e) =>
                              handleTextEvent(e, "mandaysAllocated")
                            }
                            className="numRight"
                            type="number"
                            onKeyPress={(event) => {
                              if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span style={{ color: "red" }}>
                            {formError["mandaysAllocated_isEmpty"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                          <label>Total Allocated Mandays</label>
                          <InputForm
                            placeholder={""}
                            isDisabled={true}
                            textArea={false}
                            value={totalMandaysAllocated}
                            onChange={(e) =>
                              handleTextEvent(e, "totalMandaysAllocated")
                            }
                            className="numRight"
                            type="number"
                            onKeyPress={(event) => {
                              if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span style={{ color: "red" }}>
                            {formError["totalMandaysAllocated_isEmpty"]}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : typeofEngagement.label === "AMC" ||
                    typeofEngagement.label === "PROJECT" ||
                    typeofEngagement.label === "PRODUCT" ||
                    typeofEngagement.label === "INTERNAL" ? (
                    <>
                      <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                          <label>
                            Mandays Allocated<sup>*</sup>
                          </label>
                          <InputForm
                            placeholder={""}
                            isDisabled={false}
                            textArea={false}
                            value={mandaysAllocated}
                            onChange={(e) =>
                              handleTextEvent(e, "mandaysAllocated")
                            }
                            className="numRight"
                            type="number"
                            onKeyPress={(event) => {
                              if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span style={{ color: "red" }}>
                            {formError["mandaysAllocated_isEmpty"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                          <label>Total Allocated Mandays</label>
                          <InputForm
                            placeholder={""}
                            isDisabled={true}
                            textArea={false}
                            value={totalMandaysAllocated}
                            onChange={(e) =>
                              handleTextEvent(e, "totalMandaysAllocated")
                            }
                            className="numRight"
                            type="number"
                            onKeyPress={(event) => {
                              if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span style={{ color: "red" }}>
                            {formError["totalMandaysAllocated_isEmpty"]}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="float-right">
                    {/* submitFunc('reset') submitFunc('submit') */}
                    <button
                      onClick={() => submitFunc("reset")}
                      className="btn btn-reset ml-1"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => submitFunc("submit")}
                      style={{ background: "#96c61c" }}
                      className="btn btn-save ml-1"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {capacityAllocationGridData &&
              capacityAllocationGridData.length >= 0 && (
                <DynamicGrid
                  title={"Capacity Allocation"}
                  options={options}
                  data={capacityAllocationGridData}
                  columns={capacityAllocationGridDataColumns}
                />
              )}
          </section>
        </div>
      </>
      <>
        {(mandaysAllocated || fractionAllocated) && (
          <Modal
            show={showAlert}
            backdrop="static"
            keyboard={false}
            centered
            size="sm"
          >
            <Modal.Body>
              <div className="col-lg-12 col-sm-12 col-xs-12 ">
                <label className="col-form-label">
                  Are you sure , want to submit allocation with{" "}
                  {props.type === "T&M" ? (
                    <>{resourceAllocated} resource allocation</>
                  ) : (
                    <>{mandaysAllocated} mandays</>
                  )}
                </label>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  className="btn btn-reset ml-1"
                  size="sm"
                  variant="secondary"
                  onClick={() => modelClose("cancel")}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  id="ok"
                  style={{ background: "#96c61c" }}
                  className="btn btn-save ml-1"
                  variant="primary"
                  onClick={() => modelClose("ok")}
                >
                  Ok
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </>
    </>
  );
};

export default CapacityAllocation;
