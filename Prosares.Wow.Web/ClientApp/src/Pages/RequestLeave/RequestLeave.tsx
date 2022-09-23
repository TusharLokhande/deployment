import React, { useState } from "react";
import SelectForm from "../../Components/SelectForm/SelectForm";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import InputForm from "../../Components/InputForm/InputForm";

function RequestLeave() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [fromDateType, setFromDateType] = useState<any>({});
  const [toDateType, setToDateType] = useState<any>({});
  const [reason, setReason] = useState<any>({});

  const [noOfDaysLeave, setNoOfDaysLeave] = useState<any>("");
  const [availableBalance, setAvailableBalance] = useState<any>("");
  const [remarks, setRemarks] = useState<any>("");

  const handleTextEvent = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "toDate") {
      setToDate(event);
    }
    if (apiFieldName === "fromDate") {
      setFromDate(event);
    }

    if (apiFieldName === "noOfDaysLeave") {
      setNoOfDaysLeave(event.target.value);
    }
    if (apiFieldName === "availableBalance") {
      setAvailableBalance(event.target.value);
    }
    if (apiFieldName === "remarks") {
      setRemarks(event.target.value);
    }
  };
  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "fromDateType") {
      setFromDateType(event);
    }
    if (apiFieldName === "toDateType") {
      setToDateType(event);
    }
    if (apiFieldName === "reason") {
      setReason(event);
    }
  };
  return (
    <div>
      <section className="bg_breadcrumb">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h4>Request Leave /Report Absence (Unplanned)</h4>
            </div>
          </div>
        </div>
      </section>
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                {/* <label>Incident date</label> */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From date"
                    value={fromDate}
                    onChange={(e) => handleTextEvent(e, "fromDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Type</label>
                <SelectForm
                  options={[
                    {
                      value: 1,
                      label: "Full Day",
                    },
                    {
                      value: 2,
                      label: "First Half",
                    },
                    {
                      value: 3,
                      label: "Second Half",
                    },
                  ]}
                  placeholder="Select"
                  isDisabled={false}
                  value={fromDateType}
                  onChange={(event) => selectOnChange(event, "fromDateType")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                {/* <label>Incident date</label> */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To date"
                    value={toDate}
                    onChange={(e) => handleTextEvent(e, "toDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Type</label>
                <SelectForm
                  options={[
                    {
                      value: 1,
                      label: "Full Day",
                    },
                    {
                      value: 2,
                      label: "First Half",
                    },
                    {
                      value: 3,
                      label: "Second Half",
                    },
                  ]}
                  placeholder="Select"
                  isDisabled={false}
                  value={toDateType}
                  onChange={(event) => selectOnChange(event, "toDateType")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>No of Days Leave</label>
                  <InputForm
                    placeholder={""}
                    isDisabled={true}
                    textArea={false}
                    value={noOfDaysLeave}
                    onChange={(e) => handleTextEvent(e, "noOfDaysLeave")}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>Available Balance</label>
                  <InputForm
                    placeholder={""}
                    isDisabled={true}
                    textArea={false}
                    value={availableBalance}
                    onChange={(e) => handleTextEvent(e, "availableBalance")}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>Reason</label>
                  <SelectForm
                    options={[
                      {
                        value: 1,
                        label: "Unplanned Absence",
                      },
                      {
                        value: 2,
                        label: "Health Reasons",
                      },
                      {
                        value: 3,
                        label: "Family health reasons",
                      },
                      {
                        value: 4,
                        label: "Vacation",
                      },
                      {
                        value: 5,
                        label: "Other",
                      },
                    ]}
                    placeholder="Select"
                    isDisabled={false}
                    value={reason}
                    onChange={(event) => selectOnChange(event, "reason")}
                    isMulti={false}
                    noIndicator={false}
                    noSeparator={false}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>Remarks (Optional)</label>
                  <InputForm
                    placeholder={""}
                    isDisabled={false}
                    textArea={true}
                    value={remarks}
                    onChange={(e) => handleTextEvent(e, "remarks")}
                  />
                </div>
              </div>
            </div>
            {/* row end */}
            <div className="row">
              <div className="col-lg-12">
                <div className="float-right">
                  <button className="btn btn-reset ml-1">Reset</button>
                  <button
                    style={{ background: "#96c61c" }}
                    className="btn btn-save ml-1">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RequestLeave;
