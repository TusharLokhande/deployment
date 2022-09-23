import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InputForm from "../../../Components/InputForm/InputForm";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import { APICall } from "../../../Helpers/API/APICalls";
import { Decrypt } from "../../../Helpers/Cryptography/AES";
import CryptoJS from "crypto-js";
import { ApplicationContext } from "../../../Routes/Routes";
import {
  GetDropDownList,
  insertUpdateMilestoneDataUrl,
  getMilestoneDataByIdUrl,
  CheckIfMilestoneExists,
} from "../../../Helpers/API/APIEndPoints";
import "./MilestoneMaster.css";
import { getContext } from "../../../Helpers/Context/Context";
import Heading from "../../../Components/Heading/Heading";

const MilestoneMasterEdit = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [milestone, setMilestone] = useState("");
  const [amount, setAmount] = useState("");
  const [engagement, setEngagement] = useState(null);
  const [plannedDate, setPlannedDate] = useState(null);
  const [revisedDate, setRevisedDate] = useState(null);
  const [completedDate, setCompletedDate] = useState(null);
  const [invoicedDate, setInvoicedDate] = useState(null);
  const [engagementDropdown, setEngagementDropdown] = useState([]);
  const [EngagementOptions, setEngagementOptions] = useState<any>([]);
  const [createdDate, setCreatedDate] = useState<any>(null);
  const [plannedManDays, setPlannedManDays] = useState(0);
  const [actualManDays, setActualManDays] = useState(0);
  const [balanceManDays, setBalanceManDays] = useState(0);

  const [formErrors, setFormErrors] = useState<any>({});
  const context = getContext();
  let formErrorObj = {};

  useEffect(() => {
    onLoadAPI();
  }, []);

  useEffect(() => {
    setBalanceManDays(+plannedManDays - +actualManDays);
  }, [actualManDays, plannedManDays]);

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName == "engagement") {
      await setEngagement(event);
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
    }
  };
  const handleTextEvent = async (event: any, apiFieldName: any) => {
    if (apiFieldName == "milestone") {
      let milestone = event.target.value;
      await setMilestone(milestone);
      var test = /^[a-zA-Z\s]+$/.test(milestone);

      await setFormErrors({
        ...formErrors,
        ["Milestone_isEmpty"]: "",
        ["Milestone_exists"]: "",
      });
      if (milestone == undefined || milestone == null || milestone == "") {
        await setFormErrors({
          ...formErrors,
          ["Milestone_isEmpty"]: "Milestone cannot be empty",
        });
      }
    }

    if (apiFieldName == "Amount") {
      let amount = event.target.value;
      await setAmount(amount);
      var test = /^\d*\.?\d*$/.test(amount);
      if (test) {
        await setFormErrors({
          ...formErrors,
          ["Amount_isEmpty"]: "",
        });
        if (amount == undefined || amount == null || amount == "") {
          await setFormErrors({
            ...formErrors,
            ["Amount_isEmpty"]: "Amount cannot be empty",
          });
        }
      } else {
        await setFormErrors({
          ...formErrors,
          ["Amount_isEmpty"]: "Invalid characters",
        });
      }
    }

    if (apiFieldName == "plannedDate") {
      let plannedDate = event;
      await setPlannedDate(plannedDate);

      //Changes Made By Sai Date 15-09-2022
      await setRevisedDate(plannedDate);
      //
      await setFormErrors({
        ...formErrors,
        ["plannedDate_isEmpty"]: "",
      });
      if (
        plannedDate == undefined ||
        plannedDate == null ||
        plannedDate == ""
      ) {
        await setFormErrors({
          ...formErrors,
          ["plannedDate_isEmpty"]: "Planned Date cannot be empty",
        });
      }
    }

    if (apiFieldName == "revisedDate") {
      let revisedDate = event;
      await setRevisedDate(revisedDate);
      await setFormErrors({
        ...formErrors,
        ["revisedDate_isEmpty"]: "",
      });
      if (
        revisedDate == undefined ||
        revisedDate == null ||
        revisedDate == ""
      ) {
        await setFormErrors({
          ...formErrors,
          ["revisedDate_isEmpty"]: "Revised Date cannot be empty",
        });
      }
    }

    if (apiFieldName == "completedDate") {
      let completedDate = event;
      await setCompletedDate(completedDate);
      await setFormErrors({
        ...formErrors,
        ["completedDate_isEmpty"]: "",
      });
      // if (
      //   completedDate == undefined ||
      //   completedDate == null ||
      //   completedDate == ""
      // ) {
      //   await setFormErrors({
      //     ...formErrors,
      //     ["completedDate_isEmpty"]: "Completed Date cannot be empty",
      //   });
      // }
    }

    if (apiFieldName == "invoicedDate") {
      let invoicedDate = event;
      await setInvoicedDate(invoicedDate);
      await setFormErrors({
        ...formErrors,
        ["invoicedDate_isEmpty"]: "",
      });
      // if (
      //   invoicedDate == undefined ||
      //   invoicedDate == null ||
      //   invoicedDate == ""
      // ) {
      //   await setFormErrors({
      //     ...formErrors,
      //     ["invoicedDate_isEmpty"]: "Invoiced Date cannot be empty",
      //   });
      // }
    }
  };

  const checkValidations = async () => {
    var objError = {};

    const data1 = await APICall(CheckIfMilestoneExists, "POST", {
      milestones: milestone,
    });
    if (data1 != undefined || data1 != null) {
      if (data1.data === true && state == null) {
        objError["Milestone_exists"] = "Milestone already exists";
      }
    }

    if (milestone == undefined || milestone == null || milestone == "") {
      objError["Milestone_isEmpty"] = "Milestone cannot be empty";
    }

    if (amount == undefined || amount == null || amount == "") {
      objError["Amount_isEmpty"] = "Amount cannot be empty";
    }
    if (engagement == undefined || engagement == null || engagement == "") {
      objError["engagement_isEmpty"] = "Select Engagement";
    }

    if (plannedDate == undefined || plannedDate == null || plannedDate == "") {
      objError["plannedDate_isEmpty"] = "Planned Date cannot be empty";
    }

    if (revisedDate == undefined || revisedDate == null || revisedDate == "") {
      objError["revisedDate_isEmpty"] = "Revised Date cannot be empty";
    }

    // if (
    //   completedDate == undefined ||
    //   completedDate == null ||
    //   completedDate == ""
    // ) {
    //   objError["completedDate_isEmpty"] = "Completed Date cannot be empty";
    // }

    // if (
    //   invoicedDate == undefined ||
    //   invoicedDate == null ||
    //   invoicedDate == ""
    // ) {
    //   objError["invoicedDate_isEmpty"] = "Invoiced Date cannot be empty";
    // }
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
        let reqObject = {};
        if (state !== null) {
          reqObject = {
            id: state,
            MileStones: milestone,
            EngagementId: engagement.value,
            Amount: parseFloat(amount),
            PlannedDate: plannedDate,
            RevisedDate: revisedDate,
            CompletedDate: completedDate,
            InvoicedDate: invoicedDate,
            MandaysBalance: balanceManDays,
            MandaysPlanned: plannedManDays,
            MandaysActual: actualManDays,
            isActive: true,
            createdDate: createdDate,
            modifiedDate: new Date(),
          };
        } else {
          reqObject = {
            MileStones: milestone,
            EngagementId: engagement.value,
            Amount: parseFloat(amount),
            PlannedDate: plannedDate,
            RevisedDate: revisedDate,
            CompletedDate: completedDate,
            InvoicedDate: invoicedDate,
            MandaysBalance: balanceManDays,
            MandaysPlanned: plannedManDays,
            MandaysActual: actualManDays,
            isActive: true,
            createdDate: new Date(),
          };
        }

        const data = await APICall(
          insertUpdateMilestoneDataUrl,
          "POST",
          reqObject
        );

        if (data.status === 0) {
          navigate(-1);
        }
      }
    } else {
      setFormErrors({});
      setMilestone("");
      setAmount("");
      setEngagement(null);
      setPlannedDate(null);
      setRevisedDate(null);
      setCompletedDate(null);
      setInvoicedDate(null);
      setCreatedDate(null);
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

  const onLoadAPI = async () => {
    //Engagement Dropdown
    let EmployeeId = context.EmployeeId; //h
    var data = await CommonDropdownFunction("onlyEngagement", EmployeeId);

    if (data != undefined || data != null) {
      let engagementArray = [];
      await data.map((engagement) => {
        let tempObj = {
          label: `${engagement.engagement}`,
          value: engagement.id,
        };
        engagementArray.push(tempObj);
      });

      engagementArray.sort((a, b) => a.label.localeCompare(b.label));

      var tempArray = [...engagementArray];
      setEngagementOptions(tempArray);
    }

    if (state != null || state != undefined) {
      const data1 = await APICall(getMilestoneDataByIdUrl, "POST", {
        id: state,
      });

      if (
        data1 != undefined ||
        data1.data != undefined ||
        data1 != null ||
        data1.data != null
      ) {
        setAmount(data1.data.amount);

        tempArray.map((engagement) => {
          if (engagement.value == data1.data.engagementId) {
            setEngagement(engagement);
          }
        });
        setCompletedDate(data1.data.completedDate);
        setMilestone(data1.data.mileStones);
        setPlannedDate(data1.data.plannedDate);
        setRevisedDate(data1.data.revisedDate);
        setCompletedDate(data1.data.completedDate);
        setInvoicedDate(data1.data.invoicedDate);
        setPlannedManDays(data1.data.mandaysPlanned);
        setActualManDays(data1.data.mandaysActual);
        setBalanceManDays(data1.data.mandaysBalance);
        setCreatedDate(data1.data.createdDate);
      }
    }
  };
  return (
    <>
      <Heading title={"Milestone"} />
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Milestone<sup>*</sup>
                </label>
                <InputForm
                  placeholder={"Milestone"}
                  isDisabled={false}
                  textArea={false}
                  value={milestone}
                  onChange={(e) => handleTextEvent(e, "milestone")}
                />

                <p style={{ color: "red" }}>
                  {formErrors["Milestone_exists"]}

                  {formErrors["Milestone_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Amount<sup>*</sup>
                </label>
                <InputForm
                  placeholder={"Amount"}
                  className={"numRight"}
                  isDisabled={false}
                  textArea={false}
                  value={amount}
                  onChange={(e) => handleTextEvent(e, "Amount")}
                />
                <p style={{ color: "red" }}>{formErrors["Amount_isEmpty"]}</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Engagement<sup>*</sup>
                </label>
                <SelectForm
                  options={EngagementOptions}
                  placeholder="Select"
                  isDisabled={false}
                  value={engagement}
                  onChange={(event) => selectOnChange(event, "engagement")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
                <p style={{ color: "red" }}>
                  {formErrors["engagement_isEmpty"]}
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Planned Date"
                    value={plannedDate}
                    onChange={(e) => handleTextEvent(e, "plannedDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" required {...params} />
                    )}
                  />
                </LocalizationProvider>
                <p style={{ color: "red" }}>
                  {formErrors["plannedDate_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Revised Date"
                    value={revisedDate}
                    onChange={(e) => handleTextEvent(e, "revisedDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" required {...params} />
                    )}
                  />
                </LocalizationProvider>
                <p style={{ color: "red" }}>
                  {formErrors["revisedDate_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Completed Date"
                    value={completedDate}
                    onChange={(e) => handleTextEvent(e, "completedDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
                <p style={{ color: "red" }}>
                  {formErrors["completedDate_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Invoiced Date"
                    value={invoicedDate}
                    onChange={(e) => handleTextEvent(e, "invoicedDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
                <p style={{ color: "red" }}>
                  {formErrors["invoicedDate_isEmpty"]}
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-reset ml-1"
              onClick={(e) => onClickFunction(e, "Reset")}
            >
              Reset
            </button>
            <button
              onClick={(e) => onClickFunction(e, "Submit")}
              className="btn btn-primary"
            >
              Submit
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Back
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default MilestoneMasterEdit;
