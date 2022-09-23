import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  GetDropDownList,
  getEngagementMasterDataById,
  InsertUpdateEngagementMasterData,
} from "../../../Helpers/API/APIEndPoints";
import InputForm from "../../../Components/InputForm/InputForm";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import moment from "moment";
import {
  billingOptions,
  enagagementTypeOptions,
  engagementStatusOptions,
  poStatusOptions,
} from "../../../Common/CommonJson";
import notify from "../../../Helpers/ToastNotification";
import { getContext } from "../../../Helpers/Context/Context";

const EngagementMasterEdit = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [engagement, setEngagement] = useState("");
  const [povalue, setPovalue] = useState("");
  const [pomonths, setPomonths] = useState("");
  const [poResourcesPerMonth, setPoResourcesPerMonth] = useState("");
  const [budgetResourcesPerMonth, setBudgetResourcesPerMonth] = useState("");
  const [poMandaysPerMonth, setPoMandaysPerMonth] = useState("");
  const [budgetMandaysPerMonth, setBudgetMandaysPerMonth] = useState("");
  const [poMandays, setPoMandays] = useState("");
  const [budgetMandays, setBudgetMandays] = useState("");
  const [balanceMandays, setBalanceMandays] = useState("");
  const [spentMandays, setSpentMandays] = useState("");
  const [invoiceValue, setInvoiceValue] = useState("");
  const [balanceValue, setBalanceValue] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [submitId, setSubmitId] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [customer, setCustomer] = useState<any>({});
  const [enagagementType, setEnagagementType] = useState<any>({});
  const [poStatus, setPoStatus] = useState<any>(poStatusOptions[2]);
  const [billing, setBilling] = useState<any>({});
  const [application, setApplication] = useState<any>([]);
  const [engagementStatus, setEngagementStatus] = useState<any>({});
  const [phase, setPhase] = useState<any>([]);
  const [poExpiryDate, setPoExpiryDate] = useState<Date | null>(null);
  const [poCompletionDate, setPoCompletionDate] = useState<Date | null>(null);
  const [
    plannedCompletionDate,
    setPlannedCompletionDate,
  ] = useState<Date | null>(null);
  const [actualCompletionDate, setActualCompletionDate] = useState<Date | null>(
    null
  );
  const [customerOptions, setCustomerOptions] = useState<any>([]);
  const [applicationsOptions, setApplicationsOptions] = useState<any>([]);
  const [phasesOptions, setPhasesOptions] = useState<any>([]);
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const context = getContext();
  let formErrorObj = {};

  const submitApiCall = async (submitObj: any) => {
    const { data } = await APICall(
      InsertUpdateEngagementMasterData,
      "POST",
      submitObj
    );
    if (data && data > 0) {
      navigate(-1);
      if (submitId) {
        setSubmitId(0);
        notify(0, "Engagement updated successfully");
      } else {
        setSubmitId(0);
        notify(0, "Engagement inserted successfully");
      }
    } else {
      if (submitId) {
        notify(1, "Engagement updation fail");
      } else {
        setSubmitId(0);
        notify(1, "Engagement insertion fail");
      }
    }
  };

  const resetFunc = () => {
    setSubmitId(0);
    setCustomer({});
    setPoExpiryDate(null);
    setEngagement("");
    setPovalue("");
    setPomonths("");
    setBilling({});
    setPoResourcesPerMonth("");
    setBudgetResourcesPerMonth("");
    setPoMandaysPerMonth("");
    setBudgetMandaysPerMonth("");
    setInvoiceValue("");
    setBalanceValue("");
    setActualCost("");
    setSpentMandays("");
    setPoMandays("");
    setBudgetMandays("");
    setIsActive(false);
    setPoCompletionDate(null);
    setPlannedCompletionDate(null);
    setActualCompletionDate(null);
    setPoStatus(poStatusOptions[2]);
    setEngagementStatus({});
    setEnagagementType({});
  };

  const customerApiCall = async () => {
    let postObject = {
      searchFor: "customer",
      searchValue: 1,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data != undefined || data != null) {
      let customerArray = [];
      await data.map((customer: any) => {
        let tempObj = {
          abb: customer.abbreviation,
          value: customer.id,
          label: customer.name,
        };
        customerArray.push(tempObj);
      });
      setCustomerOptions(customerArray);
    }
  };

  const applicationsApiCall = async () => {
    let postObject = {
      searchFor: "applications",
      searchValue: 1,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data != undefined || data != null) {
      let applicationArray = [];
      await data.map((application: any) => {
        let tempObj = {
          value: application.id,
          label: application.application,
        };
        applicationArray.push(tempObj);
      });
      setApplicationsOptions(applicationArray);
    }
  };

  const phaseApiCall = async () => {
    let postObject = {
      searchFor: "phases",
      searchValue: 1,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data != undefined || data != null) {
      let phaseArray = [];
      await data.map((phase: any) => {
        let tempObj = {
          value: phase.id,
          label: phase.phase,
        };
        phaseArray.push(tempObj);
      });
      setPhasesOptions(phaseArray);
    }
  };

  const getEngagementByIdApiCall = async () => {
    if (state !== null) {
      let post = {
        id: state,
      };
      const { data } = await APICall(getEngagementMasterDataById, "POST", post);
      if (data !== null || typeof data !== "string") {
        let SpentMandates = 0;
        setSubmitId(data.id);
        setCustomer({ value: data.customerId, label: data.customerName });
        setEngagement(data.engagement);
        setPovalue(
          Number(data.povalue)
            .toFixed(2)
            .toString()
        );
        setPomonths(
          Number(data.pomonths)
            .toFixed(2)
            .toString()
        );
        setPoResourcesPerMonth(
          Number(data.poresourcesPerMonth)
            .toFixed(2)
            .toString()
        );
        setBudgetResourcesPerMonth(
          Number(data.budgetResoucesPerMonth)
            .toFixed(2)
            .toString()
        );
        setPoMandaysPerMonth(
          Number(data.pomanDaysPerMonth)
            .toFixed(2)
            .toString()
        );
        setBudgetMandaysPerMonth(
          Number(data.budgetMandaysPerMonth)
            .toFixed(2)
            .toString()
        );
        setInvoiceValue(
          Number(data.invoiceValue)
            .toFixed(2)
            .toString()
        );
        setPoMandays(
          Number(data.pomanDays)
            .toFixed(2)
            .toString()
        );
        setBudgetMandays(
          Number(data.budgetMandays)
            .toFixed(2)
            .toString()
        );
        setIsActive(data.isActive);
        if (data.poexpiry) {
          setPoExpiryDate(new Date(data.poexpiry));
        } else {
          setPoExpiryDate(null);
        }
        if (data.pocompletionDate) {
          setPoCompletionDate(new Date(data.pocompletionDate));
        } else {
          setPoCompletionDate(null);
        }
        if (data.plannedCompletionDate) {
          setPlannedCompletionDate(new Date(data.plannedCompletionDate));
        } else {
          setPlannedCompletionDate(null);
        }
        if (data.actualCompletionDate) {
          setActualCompletionDate(new Date(data.actualCompletionDate));
        } else {
          setActualCompletionDate(null);
        }
        if (data.hoursSpent && data.hoursSpent >= 0) {
          SpentMandates = Number(data.hoursSpent) / 8.5;
          setSpentMandays(
            Number(SpentMandates)
              .toFixed(2)
              .toString()
          );
        }
        if (
          data.povalue &&
          data.povalue >= 0 &&
          data.invoiceValue &&
          data.invoiceValue >= 0
        ) {
          let BalanceValue = Number(data.povalue) - Number(data.invoiceValue);
          setBalanceValue(
            Number(BalanceValue)
              .toFixed(2)
              .toString()
          );
        }
        if (
          data.budgetMandays &&
          data.budgetMandays >= 0 &&
          SpentMandates &&
          SpentMandates >= 0
        ) {
          let BalanceMandays =
            Number(data.budgetMandays) - Number(SpentMandates);
          setBalanceMandays(
            Number(BalanceMandays)
              .toFixed(2)
              .toString()
          );
        }
        if (SpentMandates && SpentMandates >= 0) {
          let ActualCost = Number(SpentMandates) * 7000;
          setActualCost(
            Number(ActualCost)
              .toFixed(2)
              .toString()
          );
        }
        billingOptions.map((option: any) => {
          if (option.value === data.billing) {
            setBilling(option);
          }
        });
        poStatusOptions.map((option: any) => {
          if (option.value === data.postatus) {
            setPoStatus(option);
          }
        });
        engagementStatusOptions.map((option: any) => {
          if (option.value === data.engagementStatus) {
            setEngagementStatus(option);
          }
        });
        enagagementTypeOptions.map((option: any) => {
          if (option.value === data.engagementType) {
            setEnagagementType(option);
          }
        });
      }
    }
  };

  const onLoadApiCall = async () => {
    await customerApiCall();
    await applicationsApiCall();
    await phaseApiCall();
    if (state !== null) {
      let post = {
        id: state,
      };
      await getEngagementByIdApiCall();
      await setEditMode(true);
    } else {
      await setEngagementStatus({
        label: "Not Started",
        value: 1,
      });
      await setSpentMandays("0");
      await setBalanceMandays("0");
      await setInvoiceValue("0");
      await setBalanceValue("0");
      await setActualCost("0");
      await setEditMode(false);
    }
  };

  useEffect(() => {
    onLoadApiCall();
  }, []);

  const onSubmitValidation = async () => {
    await setFormErrors({});
    if (
      !engagement ||
      engagement === "" ||
      engagement.toString().trim() === ""
    ) {
      setFormErrors((preState) => ({
        ...preState,
        ["engagement_isEmpty"]: "Egagement can not be empty",
      }));
      formErrorObj["engagement_isEmpty"] = "Engagement can not be empty";
    }
    if (!povalue || povalue === "" || povalue.toString().trim() === "") {
      setFormErrors((preState) => ({
        ...preState,
        ["povalue_isEmpty"]: "PO value can not be empty",
      }));
      formErrorObj["povalue_isEmpty"] = "PO value can not be empty";
    } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(povalue)) {
      setFormErrors((preState) => ({
        ...preState,
        ["povalue_isEmpty"]: "PO value should have maximum 2 decimals only",
      }));
      formErrorObj["povalue_isEmpty"] =
        "PO value should have maximum 2 decimals only";
    }
    // if (!poExpiryDate) {
    //   setFormErrors((preState) => ({
    //     ...preState,
    //     ["poExpiryDate_isEmpty"]: "PO Expiry Date can not be empty",
    //   }));
    //   formErrorObj["poExpiryDate_isEmpty"] = "PO Expiry Date can not be empty";
    // }
    if (!customer || Object.keys(customer).length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["customer_isEmpty"]: "Customer can not be empty",
      }));
      formErrorObj["customer_isEmpty"] = "Customer can not be empty";
    }
    if (!poStatus || Object.keys(poStatus).length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["poStatus_isEmpty"]: "PO status type can not be empty",
      }));
      formErrorObj["poStatus_isEmpty"] = "PO status type can not be empty";
    }
    if (!enagagementType || Object.keys(enagagementType).length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["enagagementType_isEmpty"]: "Engagement type can not be empty",
      }));
      formErrorObj["enagagementType_isEmpty"] =
        "Engagement type can not be empty";
    }
    if (enagagementType.label === "AMC" || enagagementType.label === "T&M") {
      if (!pomonths || pomonths === "" || pomonths.toString().trim() === "") {
        setFormErrors((preState) => ({
          ...preState,
          ["pomonths_isEmpty"]: "PO months can not be empty",
        }));
        formErrorObj["pomonths_isEmpty"] = "PO months can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(pomonths)) {
        setFormErrors((preState) => ({
          ...preState,
          ["pomonths_isEmpty"]: "PO months should have maximum 2 decimals only",
        }));
        formErrorObj["pomonths_isEmpty"] =
          "PO months should have maximum 2 decimals only";
      }
      if (!billing || Object.keys(billing).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["billing_isEmpty"]: "billing can not be empty",
        }));
        formErrorObj["billing_isEmpty"] = "billing can not be empty";
      }
      if (
        (!poResourcesPerMonth ||
          poResourcesPerMonth === "" ||
          poResourcesPerMonth.toString().trim() === "") &&
        enagagementType.label === "T&M"
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["poResourcesPerMonth_isEmpty"]:
            "PO resources per month can not be empty",
        }));
        formErrorObj["poResourcesPerMonth_isEmpty"] =
          "PO resources per month can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(poResourcesPerMonth)) {
        setFormErrors((preState) => ({
          ...preState,
          ["poResourcesPerMonth_isEmpty"]:
            "PO resources per month should have maximum 2 decimals only",
        }));
        formErrorObj["poResourcesPerMonth_isEmpty"] =
          "PO resources per month should have maximum 2 decimals only";
      }
      if (
        (!budgetResourcesPerMonth ||
          budgetResourcesPerMonth === "" ||
          budgetResourcesPerMonth.toString().trim() === "") &&
        enagagementType.label === "T&M"
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetResourcesPerMonth_isEmpty"]:
            "Budget resources per month can not be empty",
        }));
        formErrorObj["budgetResourcesPerMonth_isEmpty"] =
          "Budget resources per month can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(budgetResourcesPerMonth)) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetResourcesPerMonth_isEmpty"]:
            "Budget resources per month should have maximum 2 decimals only",
        }));
        formErrorObj["budgetResourcesPerMonth_isEmpty"] =
          "Budget resources per month should have maximum 2 decimals only";
      }
      if (
        (!poMandaysPerMonth ||
          poMandaysPerMonth === "" ||
          poMandaysPerMonth.toString().trim() === "") &&
        enagagementType.label === "AMC"
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["poMandaysPerMonth_isEmpty"]:
            "PO mandays per month can not be empty",
        }));
        formErrorObj["poMandaysPerMonth_isEmpty"] =
          "PO mandays per month can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(poMandaysPerMonth)) {
        setFormErrors((preState) => ({
          ...preState,
          ["poMandaysPerMonth_isEmpty"]:
            "PO mandays per month should have maximum 2 decimals only",
        }));
        formErrorObj["poMandaysPerMonth_isEmpty"] =
          "PO mandays per month should have maximum 2 decimals only";
      }
      if (
        (!budgetMandaysPerMonth ||
          budgetMandaysPerMonth === "" ||
          budgetMandaysPerMonth.toString().trim() === "") &&
        enagagementType.label === "AMC"
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetMandaysPerMonth_isEmpty"]:
            "Budget mandays per month can not be empty",
        }));
        formErrorObj["budgetMandaysPerMonth_isEmpty"] =
          "Budget mandays per month can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(budgetMandaysPerMonth)) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetMandaysPerMonth_isEmpty"]:
            "Budget mandays per month should have maximum 2 decimals only",
        }));
        formErrorObj["budgetMandaysPerMonth_isEmpty"] =
          "Budget mandays per month should have maximum 2 decimals only";
      }
      // if (!application || Object.keys(application).length === 0) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["application_isEmpty"]: "Application can not be empty",
      //   }));
      //   formErrorObj["engagement_isEmpty"] = "Application can not be empty"
      // }
    } else if (
      enagagementType.label === "PROJECT" ||
      enagagementType.label === "PRODUCT" ||
      enagagementType.label === "INTERNAL"
    ) {
      // if (!invoiceValue || invoiceValue === "" || invoiceValue.toString().trim() === "") {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["invoiceValue_isEmpty"]: "Invoice value can not be empty",
      //   }));
      //   formErrorObj["invoiceValue_isEmpty"] = "Invoice value can not be empty"
      // } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(invoiceValue)) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["invoiceValue_isEmpty"]: "Invoice value should have maximum 2 decimals only",
      //   }));
      //   formErrorObj["invoiceValue_isEmpty"] = "Invoice value should have maximum 2 decimals only"
      // }

      // if (!balanceValue || balanceValue === "" || balanceValue.toString().trim() === "") {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["balanceValue_isEmpty"]: "Balance value can not be empty",
      //   }));
      //   formErrorObj["balanceValue_isEmpty"] = "Balance value can not be empty"
      // } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(balanceValue)) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["balanceValue_isEmpty"]: "Balance value should have maximum 2 decimals only",
      //   }));
      //   formErrorObj["balanceValue_isEmpty"] = "Balance value should have maximum 2 decimals only"
      // }
      if (
        !poMandays ||
        poMandays === "" ||
        poMandays.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["poMandays_isEmpty"]: "PO mandays can not be empty",
        }));
        formErrorObj["poMandays_isEmpty"] = "PO mandays can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(poMandays)) {
        setFormErrors((preState) => ({
          ...preState,
          ["poMandays_isEmpty"]:
            "PO mandays should have maximum 2 decimals only",
        }));
        formErrorObj["poMandays_isEmpty"] =
          "PO mandays should have maximum 2 decimals only";
      }
      if (
        !budgetMandays ||
        budgetMandays === "" ||
        budgetMandays.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetMandays_isEmpty"]: "Budget mandays can not be empty",
        }));
        formErrorObj["budgetMandays_isEmpty"] =
          "Budget mandays can not be empty";
      } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(budgetMandays)) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetMandays_isEmpty"]:
            "Budget mandays should have maximum 2 decimals only",
        }));
        formErrorObj["budgetMandays_isEmpty"] =
          "Budget mandays should have maximum 2 decimals only";
      }
      // if (!spentMandays || spentMandays === "" || spentMandays.toString().trim() === "") {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["spentMandays_isEmpty"]: "Spent mandays can not be empty",
      //   }));
      //   formErrorObj["spentMandays_isEmpty"] = "Spent mandays can not be empty"
      // } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(spentMandays)) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["spentMandays_isEmpty"]: "Spent mandays should have maximum 2 decimals only",
      //   }));
      //   formErrorObj["spentMandays_isEmpty"] = "Spent mandays should have maximum 2 decimals only"
      // }

      // if (!balanceMandays || balanceMandays === "" || balanceMandays.toString().trim() === "") {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["balanceMandays_isEmpty"]: "Balance mandays can not be empty",
      //   }));
      //   formErrorObj["balanceMandays_isEmpty"] = "Balance mandays can not be empty"
      // } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(balanceMandays)) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["balanceMandays_isEmpty"]: "Balance mandays should have maximum 2 decimals only",
      //   }));
      //   formErrorObj["balanceMandays_isEmpty"] = "Balance mandays can not be empty"
      // }

      // if (!actualCost || actualCost === "" || actualCost.toString().trim() === "") {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["actualCost_isEmpty"]: "Actual cost can not be empty",
      //   }));
      //   formErrorObj["actualCost_isEmpty"] = "Actual cost can not be empty"
      // } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(actualCost)) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["actualCost_isEmpty"]: "Actual cost should have maximum 2 decimals only",
      //   }));
      //   formErrorObj["actualCost_isEmpty"] = "Actual cost can not be empty"
      // }

      // if (!phase || Object.keys(phase).length === 0) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["phase_isEmpty"]: "phase can not be empty",
      //   }));
      //   formErrorObj["phase_isEmpty"] = "phase can not be empty"
      // }
      if (!engagementStatus || Object.keys(engagementStatus).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["engagementStatus_isEmpty"]: "Engagement status can not be empty",
        }));
        formErrorObj["engagementStatus_isEmpty"] =
          "Engagement status can not be empty";
      }
      // if (!poCompletionDate) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["poCompletionDate_isEmpty"]: "PO Completion Date can not be empty",
      //   }));
      //   formErrorObj["poCompletionDate_isEmpty"] =
      //     "PO Completion Date can not be empty";
      // }
      // if (!plannedCompletionDate) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["plannedCompletionDate_isEmpty"]:
      //       "Planned completion date Date can not be empty",
      //   }));
      //   formErrorObj["plannedCompletionDate_isEmpty"] =
      //     "Planned completion date Date can not be empty";
      // }
      // if (!actualCompletionDate) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["actualCompletionDate_isEmpty"]: "Actual completion date can not be empty",
      //   }));
      //   formErrorObj["actualCompletionDate_isEmpty"] = "Actual completion date can not be empty"
      // }
    }
  };

  const submitFunc = async (action: any) => {
    let submitObj: any = {};
    if (action === "submit") {
      submitObj = {
        Engagement: engagement,
        CustomerId: customer.value,
        EngagementType: Number(enagagementType.value),
        EngagementStatus: Number(engagementStatus.value),
        Povalue: Number(povalue),
        Postatus: Number(poStatus.value),
        Poexpiry: moment(poExpiryDate).format(moment.HTML5_FMT.DATE),
        IsActive: isActive,
        CreatedBy: context.EmployeeId,
      };
      if (poExpiryDate === null) {
        submitObj = {
          ...submitObj,
          Poexpiry: null,
        };
      } else {
        submitObj = {
          ...submitObj,
          Poexpiry: moment(poExpiryDate).format(moment.HTML5_FMT.DATE),
        };
      }
      if (enagagementType.label === "AMC" || enagagementType.label === "T&M") {
        submitObj = {
          ...submitObj,
          Pomonths: Number(pomonths),
          Billing: Number(billing.value),
          PoresourcesPerMonth: Number(poResourcesPerMonth),
          BudgetResoucesPerMonth: Number(budgetResourcesPerMonth),
          PomanDaysPerMonth: Number(poMandaysPerMonth),
          BudgetMandaysPerMonth: Number(budgetMandaysPerMonth),
          // "ApplicationsData": application
          // let applicationRequestObject = {
          //   id: applicationId,
          //   application: application,
          //   engagementId: engagement.value,
          //   isActive: isActive,
          // }
        };
      } else if (
        enagagementType.label === "PROJECT" ||
        enagagementType.label === "PRODUCT" ||
        enagagementType.label === "INTERNAL"
      ) {
        submitObj = {
          ...submitObj,
          InvoiceValue: Number(invoiceValue),
          BalanceValue: Number(balanceValue),
          SpentMandates: Number(spentMandays),
          BalanceMandays: Number(balanceMandays),
          ActualCost: Number(actualCost),
          PocompletionDate: moment(poCompletionDate).format(
            moment.HTML5_FMT.DATE
          ),
          PlannedCompletionDate: moment(plannedCompletionDate).format(
            moment.HTML5_FMT.DATE
          ),
          ActualCompletionDate: moment(actualCompletionDate).format(
            moment.HTML5_FMT.DATE
          ),
          POManDays: Number(poMandays),
          BudgetMandays: Number(budgetMandays),
          // "PhasesData": phase
          // let phaseRequestObject = {
          //   id: phaseId,
          //   phase: phase,
          //   description: description,
          //   engagementId: engagement && engagement.value,
          //   plannedDate: plannedDate,
          //   actualDate: actualDate,
          //   isActive: isActive,
          // };
        };

        if (actualCompletionDate === null) {
          submitObj = {
            ...submitObj,
            ActualCompletionDate: null,
          };
        } else {
          submitObj = {
            ...submitObj,
            ActualCompletionDate: moment(actualCompletionDate).format(
              moment.HTML5_FMT.DATE
            ),
          };
        }

        if (plannedCompletionDate === null) {
          submitObj = {
            ...submitObj,
            PlannedCompletionDate: null,
          };
        } else {
          submitObj = {
            ...submitObj,
            PlannedCompletionDate: moment(plannedCompletionDate).format(
              moment.HTML5_FMT.DATE
            ),
          };
        }

        if (poCompletionDate === null) {
          submitObj = {
            ...submitObj,
            PocompletionDate: null,
          };
        } else {
          submitObj = {
            ...submitObj,
            PocompletionDate: moment(poCompletionDate).format(
              moment.HTML5_FMT.DATE
            ),
          };
        }
      }
      if (submitId !== 0) {
        submitObj.Id = submitId;
        submitObj.ModifiedBy = context.EmployeeId;
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

  const handleTextEvent = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "poExpiryDate") {
      setPoExpiryDate(event);
      // if (event) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["poExpiryDate_isEmpty"]: undefined,
      //   }));
      // } else {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["poExpiryDate_isEmpty"]: "PO expiry date can not be empty",
      //   }));
      // }
    }
    if (apiFieldName === "engagement") {
      setEngagement(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["engagement_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["engagement_isEmpty"]: "Egagement can not be empty",
        }));
      }
    }
    if (apiFieldName === "povalue") {
      setPovalue(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["povalue_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["povalue_isEmpty"]: "PO value can not be empty",
        }));
      }
    }
    if (apiFieldName === "pomonths") {
      setPomonths(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["pomonths_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["pomonths_isEmpty"]: "PO months can not be empty",
        }));
      }
    }
    if (apiFieldName === "poResourcesPerMonth") {
      setPoResourcesPerMonth(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["poResourcesPerMonth_isEmpty"]: undefined,
        }));
      } else if (
        enagagementType.label === "T&M" &&
        (!event.target.value || event.target.value.toString().trim() === "")
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["poResourcesPerMonth_isEmpty"]:
            "PO Resources Per Month can not be empty",
        }));
      }
    }
    if (apiFieldName === "budgetResourcesPerMonth") {
      setBudgetResourcesPerMonth(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetResourcesPerMonth_isEmpty"]: undefined,
        }));
      } else if (
        enagagementType.label === "T&M" &&
        (!event.target.value || event.target.value.toString().trim() === "")
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetResourcesPerMonth_isEmpty"]:
            "Budget Resources Per Month can not be empty",
        }));
      }
    }
    if (apiFieldName === "poMandaysPerMonth") {
      setPoMandaysPerMonth(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["poMandaysPerMonth_isEmpty"]: undefined,
        }));
      } else if (
        enagagementType.label === "AMC" &&
        (!event.target.value || event.target.value.toString().trim() === "")
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetResourcesPerMonth_isEmpty"]:
            "PO Mandays Per Month can not be empty",
        }));
      }
    }
    if (apiFieldName === "budgetMandaysPerMonth") {
      setBudgetMandaysPerMonth(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetMandaysPerMonth_isEmpty"]: undefined,
        }));
      } else if (
        enagagementType.label === "AMC" &&
        (!event.target.value || event.target.value.toString().trim() === "")
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetMandaysPerMonth_isEmpty"]:
            "Budget mandays per month value can not be empty",
        }));
      }
    }
    if (apiFieldName === "poMandays") {
      setPoMandays(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["poMandays_isEmpty"]: undefined,
        }));
      } else if (
        enagagementType.label === "PROJECT" &&
        (!event.target.value || event.target.value.toString().trim() === "")
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["poMandays_isEmpty"]: "PO Mandays can not be empty",
        }));
      }
    }
    if (apiFieldName === "budgetMandays") {
      setBudgetMandays(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetMandays_isEmpty"]: undefined,
        }));
      } else if (
        enagagementType.label === "PROJECT" &&
        (!event.target.value || event.target.value.toString().trim() === "")
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["budgetMandays_isEmpty"]: "Budget mandays can not be empty",
        }));
      }
    }
    if (apiFieldName === "spentMandays") {
      setSpentMandays(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["spentMandays_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["spentMandays_isEmpty"]: "Spent Mandays can not be empty",
        }));
      }
    }
    if (apiFieldName === "balanceMandays") {
      setBalanceMandays(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["balanceMandays_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["balanceMandays_isEmpty"]: "Balance Mandays can not be empty",
        }));
      }
    }
    if (apiFieldName === "poCompletionDate") {
      setPoCompletionDate(event);
      // if (event) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["poCompletionDate_isEmpty"]: undefined,
      //   }));
      // } else {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["poCompletionDate_isEmpty"]: "PO Completion Date can not be empty",
      //   }));
      // }
    }
    if (apiFieldName === "plannedCompletionDate") {
      setPlannedCompletionDate(event);
      // if (event) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["plannedCompletionDate_isEmpty"]: undefined,
      //   }));
      // } else {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["plannedCompletionDate_isEmpty"]:
      //       "Planned Completion Date can not be empty",
      //   }));
      // }
    }
    if (apiFieldName === "actualCompletionDate") {
      setActualCompletionDate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["actualCompletionDate_isEmpty"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["actualCompletionDate_isEmpty"]:
            "Actual Completion Date can not be empty",
        }));
      }
    }
    if (apiFieldName === "actualCost") {
      setActualCost(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["actualCost_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["actualCost_isEmpty"]: "Actual Cost value can not be empty",
        }));
      }
    }
    if (apiFieldName === "balanceValue") {
      setBalanceValue(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["balanceValue_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["balanceValue_isEmpty"]: "Balance value can not be empty",
        }));
      }
    }
    if (apiFieldName === "invoiceValue") {
      setInvoiceValue(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["invoiceValue_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["invoiceValue_isEmpty"]: "Invoice value can not be empty",
        }));
      }
    }
  };

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "customer") {
      setCustomer(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["customer_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["customer_isEmpty"]: "Customer type can not be empty",
        }));
      }
    }
    if (apiFieldName === "enagagementType") {
      setEnagagementType(event);
      if (event.label === "PROJECT") {
        setFormErrors({});
        setPomonths("");
        setBilling({});
        setPoResourcesPerMonth("");
        setBudgetResourcesPerMonth("");
        setPoMandaysPerMonth("");
        setBudgetMandaysPerMonth("");
      } else if (event.label === "AMC" || event.label === "T&M") {
        setFormErrors({});
        setInvoiceValue("");
        setBalanceValue("");
        setActualCost("");
        setSpentMandays("");
        setPoMandays("");
        setBudgetMandays("");
        setPoCompletionDate(null);
        setPlannedCompletionDate(null);
        setActualCompletionDate(null);
        setPoStatus(poStatusOptions[2]);
        setEngagementStatus({});
      }
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["enagagementType_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["enagagementType_isEmpty"]: "Enagagement type can not be empty",
        }));
      }
    }
    if (apiFieldName === "poStatus") {
      setPoStatus(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["poStatus_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["poStatus_isEmpty"]: "PO status can not be empty",
        }));
      }
    }
    if (apiFieldName === "billing") {
      setBilling(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["billing_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["billing_isEmpty"]: "Billing can not be empty",
        }));
      }
    }
    if (apiFieldName === "application") {
      setApplication(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["application_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["application_isEmpty"]: "Application can not be empty",
        }));
      }
    }
    if (apiFieldName === "engagementStatus") {
      setEngagementStatus(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["engagementStatus_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["engagementStatus_isEmpty"]: "Engagement status can not be empty",
        }));
      }
    }
    if (apiFieldName === "phases") {
      setPhase(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["phases_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["phases_isEmpty"]: "Phase can not be empty",
        }));
      }
    }
  };

  return (
    <>
      <div>
        <section className="bg_breadcrumb">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <h4>Engagement Master</h4>
              </div>
            </div>
          </div>
        </section>
        <section className="main_content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>
                    Engagement<sup>*</sup>
                  </label>
                  <InputForm
                    placeholder={"Engagement"}
                    isDisabled={false}
                    textArea={false}
                    value={engagement}
                    onChange={(e) => handleTextEvent(e, "engagement")}
                  />
                  <p style={{ color: "red" }}>
                    {formErrors["engagement_isEmpty"]}
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>
                    Customer<sup>*</sup>
                  </label>
                  <SelectForm
                    key={1}
                    options={customerOptions}
                    placeholder="Select"
                    isDisabled={false}
                    value={customer}
                    onChange={(event) => selectOnChange(event, "customer")}
                    isMulti={false}
                    noIndicator={false}
                    noSeparator={false}
                  />
                  <p style={{ color: "red" }}>
                    {formErrors["customer_isEmpty"]}
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>
                    Engagement Type<sup>*</sup>
                  </label>
                  <SelectForm
                    key={1}
                    options={enagagementTypeOptions}
                    placeholder="Select"
                    isDisabled={false}
                    value={enagagementType}
                    onChange={(event) =>
                      selectOnChange(event, "enagagementType")
                    }
                    isMulti={false}
                    noIndicator={false}
                    noSeparator={false}
                  />
                  <p style={{ color: "red" }}>
                    {formErrors["enagagementType_isEmpty"]}
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>
                    PO Value<sup>*</sup>
                  </label>
                  <InputForm
                    placeholder={"POValue"}
                    isDisabled={false}
                    textArea={false}
                    value={povalue}
                    onChange={(e) => handleTextEvent(e, "povalue")}
                    className="numRight"
                    type="number"
                    onKeyPress={(event) => {
                      if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {formErrors["povalue_isEmpty"]}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>
                    PO Status<sup>*</sup>
                  </label>
                  <SelectForm
                    key={1}
                    options={poStatusOptions}
                    placeholder="Select"
                    isDisabled={false}
                    value={poStatus}
                    onChange={(event) => selectOnChange(event, "poStatus")}
                    isMulti={false}
                    noIndicator={false}
                    noSeparator={false}
                  />
                  <p style={{ color: "red" }}>
                    {formErrors["poStatus_isEmpty"]}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>PO Expiry Date</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="PO Expiry Date"
                      value={poExpiryDate}
                      onChange={(e) => handleTextEvent(e, "poExpiryDate")}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                      minDate
                    />
                  </LocalizationProvider>
                  <p style={{ color: "red" }}>
                    {formErrors["poExpiryDate_isEmpty"]}
                  </p>
                </div>
              </div>
            </div>
            {enagagementType.label === "AMC" ||
            enagagementType.label === "T&M" ? (
              <>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        PO Months<sup>*</sup>
                      </label>
                      <InputForm
                        placeholder={"PO Months"}
                        isDisabled={false}
                        textArea={false}
                        value={pomonths}
                        onChange={(e) => handleTextEvent(e, "pomonths")}
                        className="numRight"
                        type="number"
                        onKeyPress={(event) => {
                          if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {formErrors["pomonths_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Billing<sup>*</sup>
                      </label>
                      <SelectForm
                        key={1}
                        options={billingOptions}
                        placeholder="Select"
                        isDisabled={false}
                        value={billing}
                        onChange={(event) => selectOnChange(event, "billing")}
                        isMulti={false}
                        noIndicator={false}
                        noSeparator={false}
                      />
                      <p style={{ color: "red" }}>
                        {formErrors["billing_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  {enagagementType.label === "T&M" && (
                    <>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            PO Resources / M<sup>*</sup>
                          </label>
                          <InputForm
                            placeholder={"PO Resources / M"}
                            isDisabled={false}
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
                          <p style={{ color: "red" }}>
                            {formErrors["poResourcesPerMonth_isEmpty"]}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            Budget Resources / M<sup>*</sup>
                          </label>
                          <InputForm
                            placeholder={"POValue"}
                            isDisabled={false}
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
                          <p style={{ color: "red" }}>
                            {formErrors["budgetResourcesPerMonth_isEmpty"]}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="row">
                  {enagagementType.label === "AMC" && (
                    <>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            PO Mandays / M<sup>*</sup>
                          </label>
                          <InputForm
                            placeholder={"PO Mandays / M"}
                            isDisabled={false}
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
                          <p style={{ color: "red" }}>
                            {formErrors["poMandaysPerMonth_isEmpty"]}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            Budget Mandays / M<sup>*</sup>
                          </label>
                          <InputForm
                            placeholder={"Budget Mandays / M"}
                            isDisabled={false}
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
                          <p style={{ color: "red" }}>
                            {formErrors["budgetMandaysPerMonth_isEmpty"]}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {/* <div className="col-md-4">
                <div className="form-group">
                  <label>Applications</label>
                  <SelectForm
                    key={1}
                    options={applicationsOptions}
                    placeholder="Select"
                    isDisabled={false}
                    value={application}
                    onChange={(event) =>
                      selectOnChange(event, "application")
                    }
                    isMulti={true}
                    noIndicator={false}
                    noSeparator={false} />
                  <span style={{ color: "red" }}>
                    {formErrors["application_isEmpty"]}
                  </span>
                </div>
              </div> */}
                </div>
              </>
            ) : (
              <></>
            )}
            {enagagementType.label === "PROJECT" ||
            enagagementType.label === "PRODUCT" ||
            enagagementType.label === "INTERNAL" ? (
              <>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        PO Mandays<sup>*</sup>
                      </label>
                      <InputForm
                        placeholder={"PO Mandays"}
                        isDisabled={false}
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
                      <p style={{ color: "red" }}>
                        {formErrors["poMandays_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Budget Mandays<sup>*</sup>
                      </label>
                      <InputForm
                        placeholder={"Budget Mandays"}
                        isDisabled={false}
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
                      <p style={{ color: "red" }}>
                        {formErrors["budgetMandays_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Spent Mandays</label>
                      <InputForm
                        placeholder={"Spent Mandays"}
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
                      <p style={{ color: "red" }}>
                        {formErrors["spentMandays_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Balance Mandays</label>
                      <InputForm
                        placeholder={"Balance Mandays"}
                        isDisabled={true}
                        textArea={false}
                        value={balanceMandays}
                        onChange={(e) => handleTextEvent(e, "balanceMandays")}
                        className="numRight"
                        type="number"
                        onKeyPress={(event) => {
                          if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {formErrors["balanceMandays_isEmpty"]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Engagement Status</label>
                      <SelectForm
                        key={1}
                        options={engagementStatusOptions}
                        placeholder="Select"
                        isDisabled={false}
                        value={engagementStatus}
                        onChange={(event) =>
                          selectOnChange(event, "engagementStatus")
                        }
                        isMulti={false}
                        noIndicator={false}
                        noSeparator={false}
                      />
                      <p style={{ color: "red" }}>
                        {formErrors["engagementStatus_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Invoice Value</label>
                      <InputForm
                        placeholder={"Invoice Value"}
                        isDisabled={true}
                        textArea={false}
                        value={invoiceValue}
                        onChange={(e) => handleTextEvent(e, "invoiceValue")}
                        className="numRight"
                        type="number"
                        onKeyPress={(event) => {
                          if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {formErrors["invoiceValue_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Balance Value</label>
                      <InputForm
                        placeholder={"Balance Value"}
                        isDisabled={true}
                        textArea={false}
                        value={balanceValue}
                        onChange={(e) => handleTextEvent(e, "balanceValue")}
                        className="numRight"
                        type="number"
                        onKeyPress={(event) => {
                          if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {formErrors["balanceValue_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Actual Cost</label>
                      <InputForm
                        placeholder={"Actual Cost"}
                        isDisabled={true}
                        textArea={false}
                        value={actualCost}
                        onChange={(e) => handleTextEvent(e, "actualCost")}
                        className="numRight"
                        type="number"
                        onKeyPress={(event) => {
                          if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {formErrors["actualCost_isEmpty"]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>PO Completion Date</label>
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
                          minDate
                        />
                      </LocalizationProvider>
                      <p style={{ color: "red" }}>
                        {formErrors["poCompletionDate_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Planned Completion Date</label>
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
                          minDate
                        />
                      </LocalizationProvider>
                      <p style={{ color: "red" }}>
                        {formErrors["plannedCompletionDate_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Actual Completion Date</label>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disabled={true}
                          label="Actual Completion Date"
                          value={actualCompletionDate}
                          onChange={(e) =>
                            handleTextEvent(e, "actualCompletionDate")
                          }
                          inputFormat="dd/MM/yyyy"
                          renderInput={(params) => (
                            <TextField size="small" {...params} />
                          )}
                          minDate
                        />
                      </LocalizationProvider>
                      <p style={{ color: "red" }}>
                        {formErrors["actualCompletionDate_isEmpty"]}
                      </p>
                    </div>
                  </div>
                  {/* <div className="col-md-3">
                <div className="form-group">
                  <label>Phases</label>
                  <SelectForm
                    key={1}
                    options={phasesOptions}
                    placeholder="Select Phases"
                    isDisabled={false}
                    value={phase}
                    onChange={(event) =>
                      selectOnChange(event, "phases")
                    }
                    isMulti={true}
                    noIndicator={false}
                    noSeparator={false} />
                  <span style={{ color: "red" }}>
                    {formErrors["phases_isEmpty"]}
                  </span>
                </div>
              </div> */}
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="row">
              <div className="col-md-1">
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
              <div className="d-flex justify-content-end gap-2">
                <button
                  onClick={() => submitFunc("submit")}
                  className="btn btn-primary">
                  Submit
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary">
                  Back
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EngagementMasterEdit;
