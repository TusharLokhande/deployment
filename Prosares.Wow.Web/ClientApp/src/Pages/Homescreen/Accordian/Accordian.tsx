import React, { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import InputForm from "../../../Components/InputForm/InputForm";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./Accordian.css";

function Accordian({ data }) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [status, setStatus] = useState<any>({});
  const [plannedHoursSpent, setPlannedHoursSpent] = useState<any>("");
  const [actualHoursSpent, setActualHoursSpent] = useState<any>("");
  const [todayHoursSpent, setTodayHoursSpent] = useState<any>("");
  const [plannedStartDate, setPlannedStartDate] = useState<any>("");
  const [plannedCompletedDate, setPlannedCompletedDate] = useState<any>("");
  const [actualStartDate, setActualStartDate] = useState<any>("");
  const [actualCompletedDate, setActualCompletedDate] = useState<any>("");
  const [remarks, setRemarks] = useState<any>("");

  const [fromDate, setFromDate] = React.useState<Date | null>(null);

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "status") {
      setStatus(event);
    }
  };

  const handleTextEvent = async (event: any, apiFieldName: any) => {};
  return (
    <>
      {data && (
        <>
          <div className="card">
            <div
              className="card-header main-card"
              id="headingOne"
              onClick={() => setIsActive(!isActive)}>
              <div data-toggle="collapse" data-target="#collapseOne">
                <div className="col-lg-12 row p-0 m-0">
                  <div className="col-lg-12 p-0">
                    <i
                      className="fa fa-check-circle mr-2"
                      aria-hidden="true"></i>
                    {data.task}
                    <span className="float-right">
                      {" "}
                      <i className="fa fa-chevron-down"></i>{" "}
                    </span>
                  </div>
                </div>

                <div className="col-lg-12 row p-0 m-0">
                  <div className="col-lg-12 p-0 mt-2 sub-text">
                    <span>
                      <i
                        className="fa fa-fire mr-2 red-col"
                        aria-hidden="true"></i>
                      <i
                        className="fa fa-hourglass-end mr-2 yellow-col"
                        aria-hidden="true"></i>
                      {data.engagement}{" "}
                    </span>{" "}
                    <span className="float-right red-col">
                      {data.totalHours}
                      <span className="black-col">/{data.plannedHours}H</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Collapse in={isActive}>
              <div>
                {data && data.type == "task" ? (
                  <>
                    {/* for task */}
                    <div
                      id="collapseOne"
                      className="collapse show"
                      aria-labelledby="headingOne"
                      data-parent="#accordionExample">
                      <div className="card-body">
                        <section className="main_content">
                          <div className="container-fluid">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 col-sm-6">
                                <div className="form-group">
                                  <label>Status​</label>
                                  <SelectForm
                                    options={[
                                      {
                                        value: 1,
                                        label: "Not Started",
                                      },
                                      {
                                        value: 2,
                                        label: "In progress",
                                      },
                                      {
                                        value: 3,
                                        label: "On hold",
                                      },
                                      {
                                        value: 4,
                                        label: "Completed",
                                      },
                                    ]}
                                    placeholder="Select"
                                    isDisabled={false}
                                    value={status}
                                    onChange={(event) =>
                                      selectOnChange(event, "status")
                                    }
                                    isMulti={false}
                                    noIndicator={false}
                                    noSeparator={false}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group">
                                  <div className="">
                                    <table
                                      className="table table-bordered table_grid"
                                      id="time-table">
                                      <thead>
                                        <tr>
                                          <th className=""></th>
                                          <th className="">Planned </th>
                                          <th className="">Actual</th>
                                          <th className="">Today​</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>Hours Spent</td>
                                          <td className="disabledEvent"></td>
                                          <td className="disabledEvent"></td>
                                          <td contentEditable="true"></td>
                                        </tr>
                                        <tr>
                                          <td>Start Date</td>
                                          <td className="disabledEvent">
                                            <div className="">
                                              <div className="form-group">
                                                <LocalizationProvider
                                                  dateAdapter={AdapterDateFns}>
                                                  <DatePicker
                                                    label="Date"
                                                    value={fromDate}
                                                    onChange={(e) =>
                                                      handleTextEvent(
                                                        e,
                                                        "fromDate"
                                                      )
                                                    }
                                                    inputFormat="dd/MM/yyyy"
                                                    renderInput={(params) => (
                                                      <TextField {...params} />
                                                    )}
                                                  />
                                                </LocalizationProvider>
                                              </div>
                                            </div>
                                          </td>
                                          <td
                                            className={
                                              status.value == 1
                                                ? ""
                                                : "disabledEvent"
                                            }>
                                            <div className="">
                                              <div className="form-group">
                                                <LocalizationProvider
                                                  dateAdapter={AdapterDateFns}>
                                                  <DatePicker
                                                    label="Date"
                                                    value={fromDate}
                                                    onChange={(e) =>
                                                      handleTextEvent(
                                                        e,
                                                        "fromDate"
                                                      )
                                                    }
                                                    inputFormat="dd/MM/yyyy"
                                                    renderInput={(params) => (
                                                      <TextField {...params} />
                                                    )}
                                                  />
                                                </LocalizationProvider>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="disabledEvent"></td>
                                        </tr>
                                        <tr>
                                          <td>Completed Date</td>
                                          <td className="disabledEvent">
                                            <div className="">
                                              <div className="form-group">
                                                <LocalizationProvider
                                                  dateAdapter={AdapterDateFns}>
                                                  <DatePicker
                                                    label="Date"
                                                    value={fromDate}
                                                    onChange={(e) =>
                                                      handleTextEvent(
                                                        e,
                                                        "fromDate"
                                                      )
                                                    }
                                                    inputFormat="dd/MM/yyyy"
                                                    renderInput={(params) => (
                                                      <TextField {...params} />
                                                    )}
                                                  />
                                                </LocalizationProvider>
                                              </div>
                                            </div>
                                          </td>
                                          <td
                                            className={
                                              status.value == 4
                                                ? ""
                                                : "disabledEvent"
                                            }>
                                            <div className="">
                                              <div className="form-group">
                                                <LocalizationProvider
                                                  dateAdapter={AdapterDateFns}>
                                                  <DatePicker
                                                    label="Date"
                                                    value={fromDate}
                                                    onChange={(e) =>
                                                      handleTextEvent(
                                                        e,
                                                        "fromDate"
                                                      )
                                                    }
                                                    inputFormat="dd/MM/yyyy"
                                                    renderInput={(params) => (
                                                      <TextField {...params} />
                                                    )}
                                                  />
                                                </LocalizationProvider>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="disabledEvent"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              {/* <div className="row">
                                                        <div className="col-lg-2 col-md-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Planned</label>
                                                                <InputForm
                                                                    placeholder={""}
                                                                    isDisabled={true}
                                                                    textArea={false}
                                                                    value={plannedHoursSpent}
                                                                    onChange={(e) => handleTextEvent(e, "plannedHoursSpent")}
                                                                />
                                                            </div>
                                                        </div>



                                                        <div className="col-lg-2 col-md-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Actual</label>
                                                                <InputForm
                                                                    placeholder={""}
                                                                    isDisabled={true}
                                                                    textArea={false}
                                                                    value={actualHoursSpent}
                                                                    onChange={(e) => handleTextEvent(e, "actualHoursSpent")}
                                                                />
                                                            </div>
                                                        </div>



                                                        <div className="col-lg-2 col-md-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Today</label>
                                                                <InputForm
                                                                    placeholder={""}
                                                                    isDisabled={false}
                                                                    textArea={false}
                                                                    value={todayHoursSpent}
                                                                    onChange={(e) => handleTextEvent(e, "todayHoursSpent")}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="row">
                                                        <div className="col-lg-2 col-md-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Planned</label>
                                                                <InputForm
                                                                    placeholder={""}
                                                                    isDisabled={true}
                                                                    textArea={false}
                                                                    value={plannedStartDate}
                                                                    onChange={(e) => handleTextEvent(e, "plannedStartDate")}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-2 col-md-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Actual</label>
                                                                <InputForm
                                                                    placeholder={""}
                                                                    isDisabled={true}
                                                                    textArea={false}
                                                                    value={actualStartDate}
                                                                    onChange={(e) => handleTextEvent(e, "actualStartDate")}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-2 col-md-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Planned</label>
                                                                <InputForm
                                                                    placeholder={""}
                                                                    isDisabled={true}
                                                                    textArea={false}
                                                                    value={plannedCompletedDate}
                                                                    onChange={(e) => handleTextEvent(e, "plannedCompletedDate")}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-2 col-md-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Actual</label>
                                                                <InputForm
                                                                    placeholder={""}
                                                                    isDisabled={true}
                                                                    textArea={false}
                                                                    value={actualCompletedDate}
                                                                    onChange={(e) => handleTextEvent(e, "actualCompletedDate")}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div> */}

                              <div className="row">
                                <div className="col-lg-6 col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label>Remarks</label>
                                    <InputForm
                                      placeholder={""}
                                      isDisabled={false}
                                      textArea={true}
                                      value={remarks}
                                      onChange={(e) =>
                                        handleTextEvent(e, "remarks")
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="float-left fill-hours">
                                    <a className="mr-2">
                                      {" "}
                                      <i className="fa fa-file-alt mr-1"></i>
                                      RCA{" "}
                                    </a>
                                    <a>
                                      {" "}
                                      <i className="fa fa-clock mr-1"></i>{" "}
                                      History{" "}
                                    </a>
                                  </div>
                                  <div className="float-right">
                                    <button className="btn btn-reset ml-1">
                                      Reset
                                    </button>
                                    <button
                                      style={{ background: "#96c61c" }}
                                      className="btn btn-save ml-1">
                                      Update
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* for ticket */}
                    <div
                      id="collapseOne"
                      className="collapse show"
                      aria-labelledby="headingOne"
                      data-parent="#accordionExample">
                      <div className="card-body">
                        <section className="main_content">
                          <div className="container-fluid">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 col-sm-6">
                                <div className="form-group">
                                  <label>Status​</label>
                                  <SelectForm
                                    options={[
                                      {
                                        value: 1,
                                        label: "Not Started",
                                      },
                                      {
                                        value: 2,
                                        label: "Responded",
                                      },
                                      {
                                        value: 3,
                                        label: "Resolution in progress",
                                      },
                                      {
                                        value: 4,
                                        label: "Testing in progress",
                                      },
                                      {
                                        value: 5,
                                        label: "Resolved",
                                      },
                                    ]}
                                    placeholder="Select"
                                    isDisabled={false}
                                    value={status}
                                    onChange={(event) =>
                                      selectOnChange(event, "status")
                                    }
                                    isMulti={false}
                                    noIndicator={false}
                                    noSeparator={false}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-4 col-md-4 col-sm-6">
                                <div className="form-group">
                                  <label>Nature of Issue</label>
                                  <SelectForm
                                    options={[
                                      {
                                        value: 1,
                                        label: "Value 1",
                                      },
                                      {
                                        value: 2,
                                        label: "Value 2",
                                      },
                                      {
                                        value: 3,
                                        label: "Value 3",
                                      },
                                      {
                                        value: 4,
                                        label: "Value 4",
                                      },
                                    ]}
                                    placeholder="Select"
                                    isDisabled={false}
                                    value={status}
                                    onChange={(event) =>
                                      selectOnChange(event, "status")
                                    }
                                    isMulti={false}
                                    noIndicator={false}
                                    noSeparator={false}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-4 col-md-4 col-sm-6">
                                <div className="form-group">
                                  <label>Linked Ticket (for recurring)</label>
                                  <SelectForm
                                    options={[
                                      {
                                        value: 1,
                                        label: "Linked Ticket 1",
                                      },
                                      {
                                        value: 2,
                                        label: "Linked Ticket 2",
                                      },
                                      {
                                        value: 3,
                                        label: "Linked Ticket 3",
                                      },
                                      {
                                        value: 4,
                                        label: "Linked Ticket 4",
                                      },
                                    ]}
                                    placeholder="Select"
                                    isDisabled={false}
                                    value={status}
                                    onChange={(event) =>
                                      selectOnChange(event, "status")
                                    }
                                    isMulti={false}
                                    noIndicator={false}
                                    noSeparator={false}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group">
                                  <div className="">
                                    <table
                                      className="table table-bordered table_grid"
                                      id="time-table">
                                      <thead>
                                        <tr>
                                          <th className=""></th>
                                          <th className="">Reported </th>
                                          <th className="">Responded</th>
                                          <th className="">Resolved</th>
                                        </tr>
                                        <tr>
                                          <td>Date</td>
                                          <td className="disabledEvent">
                                            <div className="">
                                              <div className="form-group">
                                                <LocalizationProvider
                                                  dateAdapter={AdapterDateFns}>
                                                  <DatePicker
                                                    label="Date"
                                                    value={fromDate}
                                                    onChange={(e) =>
                                                      handleTextEvent(
                                                        e,
                                                        "fromDate"
                                                      )
                                                    }
                                                    inputFormat="dd/MM/yyyy"
                                                    renderInput={(params) => (
                                                      <TextField {...params} />
                                                    )}
                                                  />
                                                </LocalizationProvider>
                                              </div>
                                            </div>
                                          </td>
                                          <td
                                            className={
                                              status.value == 2
                                                ? ""
                                                : "disabledEvent"
                                            }>
                                            <div className="">
                                              <div className="form-group">
                                                <LocalizationProvider
                                                  dateAdapter={AdapterDateFns}>
                                                  <DatePicker
                                                    label="Date"
                                                    value={fromDate}
                                                    onChange={(e) =>
                                                      handleTextEvent(
                                                        e,
                                                        "fromDate"
                                                      )
                                                    }
                                                    inputFormat="dd/MM/yyyy"
                                                    renderInput={(params) => (
                                                      <TextField {...params} />
                                                    )}
                                                  />
                                                </LocalizationProvider>
                                              </div>
                                            </div>
                                          </td>
                                          <td
                                            className={
                                              status.value == 5
                                                ? ""
                                                : "disabledEvent"
                                            }>
                                            <div className="">
                                              <div className="form-group">
                                                <LocalizationProvider
                                                  dateAdapter={AdapterDateFns}>
                                                  <DatePicker
                                                    label="Date"
                                                    value={fromDate}
                                                    onChange={(e) =>
                                                      handleTextEvent(
                                                        e,
                                                        "fromDate"
                                                      )
                                                    }
                                                    inputFormat="dd/MM/yyyy"
                                                    renderInput={(params) => (
                                                      <TextField {...params} />
                                                    )}
                                                  />
                                                </LocalizationProvider>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th className=""></th>
                                          <th className="">Planned </th>
                                          <th className="">Till Date</th>
                                          <th className="">Today​</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>Hours Spent</td>
                                          <td className="disabledEvent"></td>
                                          <td className="disabledEvent"></td>
                                          <td contentEditable="true"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              {/* <div className="row">
                                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                                <div className="form-group">
                                                                    <label>Reported Date</label>
                                                                    <InputForm
                                                                        placeholder={""}
                                                                        isDisabled={true}
                                                                        textArea={false}
                                                                        value={plannedHoursSpent}
                                                                        onChange={(e) => handleTextEvent(e, "plannedHoursSpent")}
                                                                    />
                                                                </div>
                                                            </div>



                                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                                <div className="form-group">
                                                                    <label>Responded Date</label>
                                                                    <InputForm
                                                                        placeholder={""}
                                                                        isDisabled={true}
                                                                        textArea={false}
                                                                        value={actualHoursSpent}
                                                                        onChange={(e) => handleTextEvent(e, "actualHoursSpent")}
                                                                    />
                                                                </div>
                                                            </div>



                                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                                <div className="form-group">
                                                                    <label>Resolved Date</label>
                                                                    <InputForm
                                                                        placeholder={""}
                                                                        isDisabled={false}
                                                                        textArea={false}
                                                                        value={todayHoursSpent}
                                                                        onChange={(e) => handleTextEvent(e, "todayHoursSpent")}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                                <div className="form-group">
                                                                    <label>Planned</label>
                                                                    <InputForm
                                                                        placeholder={""}
                                                                        isDisabled={true}
                                                                        textArea={false}
                                                                        value={plannedCompletedDate}
                                                                        onChange={(e) => handleTextEvent(e, "plannedCompletedDate")}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                                <div className="form-group">
                                                                    <label>Till Date</label>
                                                                    <InputForm
                                                                        placeholder={""}
                                                                        isDisabled={true}
                                                                        textArea={false}
                                                                        value={actualCompletedDate}
                                                                        onChange={(e) => handleTextEvent(e, "actualCompletedDate")}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                                <div className="form-group">
                                                                    <label>Today</label>
                                                                    <InputForm
                                                                        placeholder={""}
                                                                        isDisabled={false}
                                                                        textArea={false}
                                                                        value={todayHoursSpent}
                                                                        onChange={(e) => handleTextEvent(e, "todayHoursSpent")}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div> */}

                              <div className="row">
                                <div className="col-lg-6 col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label>Remarks</label>
                                    <InputForm
                                      placeholder={""}
                                      isDisabled={false}
                                      textArea={true}
                                      value={remarks}
                                      onChange={(e) =>
                                        handleTextEvent(e, "remarks")
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="float-left fill-hours">
                                    <a className="mr-2">
                                      {" "}
                                      <i className="fa fa-file-alt mr-1"></i>
                                      Requirement{" "}
                                    </a>
                                    <a>
                                      {" "}
                                      <i className="fa fa-clock mr-1"></i>{" "}
                                      History{" "}
                                    </a>
                                  </div>
                                  <div className="float-right">
                                    <button className="btn btn-reset ml-1">
                                      Reset
                                    </button>
                                    <button
                                      style={{ background: "#96c61c" }}
                                      className="btn btn-save ml-1">
                                      Update
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Collapse>
          </div>
        </>
      )}
    </>
  );
}

export default Accordian;
