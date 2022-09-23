import React, { useContext, useEffect, useRef, useState } from "react";
import { Collapse, Modal } from "react-bootstrap";
import InputForm from "../../../Components/InputForm/InputForm";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./Accordian.css";
import { insertUpdateDashboardData } from "../../../Helpers/API/APIEndPoints";
import { APICall } from "../../../Helpers/API/APICalls";
import moment from "moment";
import notify from "../../../Helpers/ToastNotification";
import { getContext, LoaderContext } from "../../../Helpers/Context/Context";
import { BsExclamationCircle } from "react-icons/bs";

const Accordian2 = ({
  data: mainData,
  setDashboardData,
  statusDropdown,
  totalReportedHoursToday,
  futureDate = false,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  // const [status, setStatus] = useState<any>({});
  // const [plannedHoursSpent, setPlannedHoursSpent] = useState<any>("");
  // const [actualHoursSpent, setActualHoursSpent] = useState<any>("");
  // const [todayHoursSpent, setTodayHoursSpent] = useState<any>("");
  // const [plannedStartDate, setPlannedStartDate] = useState<any>("");
  // const [plannedCompletedDate, setPlannedCompletedDate] = useState<any>("");
  // const [actualStartDate, setActualStartDate] = useState<any>("");
  // const [actualCompletedDate, setActualCompletedDate] = useState<any>("");
  // const [remarks, setRemarks] = useState<any>("");

  // const [fromDate, setFromDate] = React.useState<Date | null>(null);
  const { EmployeeId } = getContext();
  // const [taskData, setTaskData] = useState([]);

  // component state
  const [data, setData] = useState(mainData);

  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [
    confirmationModalReturnValue,
    setConfirmationModalReturnValue,
  ] = useState(false);

  const closeConfirmationModal = (confirmation) => {
    if (confirmation) {
      setConfirmationModalReturnValue(confirmation);
    }
    setShowConfirmationModal(false);
  };

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "status") {
      if (event.id === 4 || event.id === 13 || event.id === 14) {
        hoursSpentRef.current.innerText = 0;
      } else if (event.id === 3) {
        if (data.actualStartDate === null) {
          setData((prev) => {
            return {
              ...prev,
              actualStartDate: new Date(),
            };
          });
        }
      } else if (event.id === 5) {
        if (data.actualEndDate === null && data.actualStartDate === null) {
          setData((prev) => {
            return {
              ...prev,
              actualStartDate: new Date(),
              actualEndDate: new Date(),
            };
          });
        } else if (
          data.actualEndDate === null &&
          data.actualStartDate !== null
        ) {
          setData((prev) => {
            return {
              ...prev,
              actualEndDate: new Date(),
            };
          });
        }
      }

      setData((prev) => {
        return {
          ...prev,
          status: event,
        };
      });
    }
  };

  const hoursSpentRef = useRef<any>();

  useEffect(() => {
    hoursSpentRef.current.innerText = data.todayHoursSpent;
  }, []);

  const handleTextEvent = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "thoursSpent") {
      // setData((prev) => {  // do this on update click
      //   return {
      //     ...prev,
      //     todayHoursSpent: hoursSpentRef.current.innerText,
      //   };
      // });
    } else if (apiFieldName === "remarks") {
      setData((prev) => {
        return {
          ...prev,
          remarks: event.target.value,
        };
      });
    } else if (apiFieldName === "actualStartDate") {
      setData((prev) => {
        return {
          ...prev,
          actualStartDate: event,
        };
      });
    } else if (apiFieldName === "actualEndDate") {
      setData((prev) => {
        return {
          ...prev,
          actualEndDate: event,
        };
      });
    }
  };

  const checkValidation = (data) => {
    let validator = true;
    if (data.todayHoursSpent === null || data.todayHoursSpent < 0) {
      validator = false;
    } else if (data.status === 3) {
      if (data.actualStartDate === null || data.todayHoursSpent === null) {
        validator = false;
      }
    } else if (data.status === 5) {
      if (data.actualEndDate === null || data.todayHoursSpent === null) {
        validator = false;
      }
    }

    return validator;
  };
  const updateData = async (data) => {
    let now = new Date().getHours();
    let timesheetDateToBe;
    /**
     *  check if value in now is between 12am and 6am
     *  12am -> 0
     *  6am -> 6
     */
    if (now >= 0 && now <= 6) {
      timesheetDateToBe = moment(new Date())
        .subtract(1, "day")
        .format(moment.HTML5_FMT.DATE);
    } else {
      timesheetDateToBe = moment(new Date()).format(moment.HTML5_FMT.DATE);
    }

    let obj = {
      id: data.id,
      todayHoursSpent: isNaN(parseFloat(hoursSpentRef.current.innerText))
        ? null
        : parseFloat(hoursSpentRef.current.innerText),
      actualStartDate: data.actualStartDate
        ? moment(data.actualStartDate).format(moment.HTML5_FMT.DATE)
        : null,
      actualEndDate: data.actualEndDate
        ? moment(data.actualEndDate).format(moment.HTML5_FMT.DATE)
        : null,
      remarks: data.remarks,
      timesheetDateToBe: timesheetDateToBe,
      status: data.status.id,
      assignedTo: EmployeeId,
      rType: "Task",
    };

    let isMax = false;
    let isNegative = false;

    // to check if totalreportedToday is > 16
    setDashboardData((prev) => {
      if (obj.todayHoursSpent < 0 || obj.todayHoursSpent === null) {
        isNegative = true;
        return prev;
      } else {
        let newData = prev.map((ele) => {
          if (ele.id === data.id) {
            if (ele.todayHoursSpent === null) {
              return {
                ...ele,
                todayHoursSpent: parseFloat(hoursSpentRef.current.innerText),
              };
            } else {
              return {
                ...ele,
                todayHoursSpent:
                  parseFloat(ele.todayHoursSpent) +
                  parseFloat(hoursSpentRef.current.innerText),
              };
            }
          } else {
            return ele;
          }
        });
        let total = newData.reduce(
          (sum, data) => (sum = sum + data.todayHoursSpent),
          0
        );
        if (total > 16) {
          isMax = true;
          return prev;
        } else {
          isMax = false;
          return prev;
        }
      }
    });

    if (isNegative) {
      notify(1, "Invalid Data!");
    } else if (isMax) {
      notify(1, "Hours cannot be greater than 16");
    } else {
      let validate = checkValidation(obj);

      if (validate) {
        // notify(0, "success");
        showLoader();
        const res = await APICall(insertUpdateDashboardData, "Post", obj);
        hideLoader();
        if (res.status === 1) {
          notify(res.status, res.message);
        } else {
          setIsActive(!isActive);
          notify(0, "Hours updated successfully!");
          // update actual today hours
          setData((prev) => {
            if (prev.todayHoursSpent === null) {
              return {
                ...prev,
                todayHoursSpent: parseFloat(hoursSpentRef.current.innerText),
              };
            } else {
              return {
                ...prev,
                todayHoursSpent:
                  parseFloat(prev.todayHoursSpent) +
                  parseFloat(hoursSpentRef.current.innerText),
              };
            }
          });

          // update total today hours
          setDashboardData((prev) => {
            return prev.map((ele) => {
              if (ele.id === data.id) {
                if (ele.todayHoursSpent === null) {
                  return {
                    ...ele,
                    todayHoursSpent: parseFloat(
                      hoursSpentRef.current.innerText
                    ),
                  };
                } else {
                  return {
                    ...ele,
                    todayHoursSpent:
                      parseFloat(ele.todayHoursSpent) +
                      parseFloat(hoursSpentRef.current.innerText),
                  };
                }
              } else {
                return ele;
              }
            });
          });
        }
      } else {
        notify(1, "Please fill required field!");
      }
    }
  };

  useEffect(() => {
    if (confirmationModalReturnValue) {
      updateData(data);
    }
    setConfirmationModalReturnValue(false);
  }, [confirmationModalReturnValue]);

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
                    {/* check status then render */}
                    {data.status.id === 5 && (
                      <i
                        className="fa fa-check-circle mr-2"
                        aria-hidden="true"></i>
                    )}
                    {data.status.id === 3 && (
                      <i
                        className="fa fa-hourglass-end mr-2 yellow-col"
                        aria-hidden="true"></i>
                    )}

                    {data.title}
                    <span className="float-right">
                      {" "}
                      <i className="fa fa-chevron-down"></i>{" "}
                    </span>
                  </div>
                </div>

                <div className="col-lg-12 row p-0 m-0">
                  <div className="col-lg-12 p-0 mt-2 sub-text">
                    <span>
                      {moment(data.plannedEndDate).isBefore(
                        moment(),
                        "day"
                      ) && (
                        <i
                          className="fa fa-fire mr-2 red-col"
                          aria-hidden="true"></i>
                      )}
                      {data.plannedEndDate.toDateString() ===
                        new Date().toDateString() && (
                        <i
                          className="fa-solid fa-bookmark mr-2 yellow-col"
                          aria-hidden="true"></i>
                      )}
                      {data.engagement &&
                        data.phaseName === null &&
                        data.applicationName === null && <>{data.engagement}</>}
                      {data.engagement && data.phaseName && (
                        <>
                          {data.engagement} - {data.phaseName}
                        </>
                      )}
                      {data.engagement && data.applicationName && (
                        <>
                          {data.engagement} - {data.applicationName}
                        </>
                      )}
                    </span>
                    <span className="float-right red-col">
                      {data.todayHoursSpent ? data.todayHoursSpent : 0}
                      <span className="black-col">/{data.hoursAssigned}H</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Collapse in={isActive}>
              <div>
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
                            <div className="col-12">
                              {/* {data.id} - {data.taskDescription} */}
                              {data.description && (
                                <>
                                  <label>Description - </label>{" "}
                                  {data.description}
                                </>
                              )}
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6">
                              <div className="form-group">
                                <label>Status</label>
                                <SelectForm
                                  options={statusDropdown}
                                  placeholder="Select"
                                  isDisabled={false}
                                  value={data.status}
                                  onChange={(event) =>
                                    selectOnChange(event, "status")
                                  }
                                  isMulti={false}
                                  noIndicator={false}
                                  noSeparator={false}
                                  getOptionLabel={(options) => options.value}
                                  getOptionValue={(options) => options.id}
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
                                        <th className="">Today</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>Hours Spent</td>
                                        <td className="disabledEvent numRight">
                                          {data.hoursAssigned}
                                        </td>
                                        <td className="disabledEvent numRight">
                                          {data.hoursSpent}
                                        </td>
                                        <td
                                          className={
                                            data.status.id === 13 ||
                                            data.status.id === 14 ||
                                            data.status.id === 4
                                              ? "disabledEvent numRight"
                                              : "numRight"
                                          }
                                          contentEditable={
                                            data.status.id === 13 ||
                                            data.status.id === 14 ||
                                            data.status.id === 4
                                              ? false
                                              : true
                                          }
                                          ref={hoursSpentRef}
                                          onInput={(e) =>
                                            handleTextEvent(
                                              e.currentTarget.textContent,
                                              "thoursSpent"
                                            )
                                          }></td>
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
                                                  value={
                                                    new Date(
                                                      data.plannedStartDate
                                                    )
                                                  }
                                                  onChange={(e) =>
                                                    handleTextEvent(
                                                      e,
                                                      "fromDate"
                                                    )
                                                  }
                                                  inputFormat="dd/MM/yyyy"
                                                  renderInput={(params) => (
                                                    <TextField
                                                      size="small"
                                                      {...params}
                                                    />
                                                  )}
                                                />
                                              </LocalizationProvider>
                                            </div>
                                          </div>
                                        </td>
                                        <td
                                          // className={
                                          //   data.status.id == 3
                                          //     ? ""
                                          //     : "disabledEvent"
                                          // }
                                          className={"disabledEvent"}>
                                          <div className="">
                                            <div className="form-group">
                                              <LocalizationProvider
                                                dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                  label="Date"
                                                  value={data.actualStartDate}
                                                  onChange={(e) =>
                                                    handleTextEvent(
                                                      e,
                                                      "actualStartDate"
                                                    )
                                                  }
                                                  inputFormat="dd/MM/yyyy"
                                                  renderInput={(params) => (
                                                    <TextField
                                                      size="small"
                                                      {...params}
                                                    />
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
                                                  value={
                                                    new Date(
                                                      data.plannedEndDate
                                                    )
                                                  }
                                                  onChange={(e) =>
                                                    handleTextEvent(
                                                      e,
                                                      "fromDate"
                                                    )
                                                  }
                                                  inputFormat="dd/MM/yyyy"
                                                  renderInput={(params) => (
                                                    <TextField
                                                      size="small"
                                                      {...params}
                                                    />
                                                  )}
                                                />
                                              </LocalizationProvider>
                                            </div>
                                          </div>
                                        </td>
                                        <td className={"disabledEvent"}>
                                          <div className="">
                                            <div className="form-group">
                                              <LocalizationProvider
                                                dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                  label="Date"
                                                  value={data.actualEndDate}
                                                  onChange={(e) =>
                                                    handleTextEvent(
                                                      e,
                                                      "actualEndDate"
                                                    )
                                                  }
                                                  inputFormat="dd/MM/yyyy"
                                                  maxDate={new Date()}
                                                  renderInput={(params) => (
                                                    <TextField
                                                      size="small"
                                                      {...params}
                                                    />
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
                            <div className="row">
                              <div className="col-lg-6 col-md-4 col-sm-6">
                                <div className="form-group">
                                  <label>Remarks</label>
                                  <InputForm
                                    placeholder={""}
                                    isDisabled={false}
                                    textArea={true}
                                    value={data.remarks ? data.remarks : ""}
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
                                    <i className="fa fa-clock mr-1"></i> History{" "}
                                  </a>
                                </div>
                                <div className="float-right">
                                  {/* <button className="btn btn-reset ml-1">
                                    Reset
                                  </button> */}
                                  <button
                                    disabled={
                                      (data.status.id === 1 ? true : false) ||
                                      (totalReportedHoursToday >= 16
                                        ? true
                                        : false) ||
                                      (futureDate ? true : false)
                                    }
                                    style={{ background: "#96c61c" }}
                                    className="btn btn-save ml-1"
                                    onClick={() => {
                                      let todayHoursSpent = isNaN(
                                        parseFloat(
                                          hoursSpentRef.current.innerText
                                        )
                                      )
                                        ? null
                                        : parseFloat(
                                            hoursSpentRef.current.innerText
                                          );

                                      if (todayHoursSpent > 9) {
                                        setShowConfirmationModal(true);
                                      } else {
                                        updateData(data);
                                      }
                                    }}>
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
              </div>
            </Collapse>
          </div>
          <>
            <Modal
              show={showConfirmationModal}
              onHide={() => closeConfirmationModal(false)}
              backdrop="static"
              keyboard={false}
              centered>
              <Modal.Header closeButton>
                <Modal.Title className="d-flex justify-content-center align-items-center gap-2">
                  Confirmation <BsExclamationCircle color="yellow" />
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>You entered hours more than 9</p>
                <p>Do you want to continue?</p>
              </Modal.Body>
              <Modal.Footer>
                <button
                  onClick={() => closeConfirmationModal(false)}
                  className="btn btn-secondary">
                  No
                </button>
                <button
                  style={{ background: "#96c61c" }}
                  onClick={() => closeConfirmationModal(true)}
                  className="btn btn-save ml-1">
                  Yes
                </button>
              </Modal.Footer>
            </Modal>
          </>
        </>
      )}
    </>
  );
};

export default Accordian2;
