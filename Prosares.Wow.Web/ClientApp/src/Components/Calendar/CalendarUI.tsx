import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./CalendarUI.css";
import "react-calendar/dist/Calendar.css";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaPowerOff,
  FaCalendarPlus,
  FaMinusCircle,
} from "react-icons/fa";
import Heading from "../Heading/Heading";
import { APICall } from "../../Helpers/API/APICalls";
import {
  getCalendarData,
  GetDropDownList,
  getEmployeeAvailableLeaveBalance,
} from "../../Helpers/API/APIEndPoints";
import { getContext } from "../../Helpers/Context/Context";
import moment from "moment";
import { Card } from "react-bootstrap";
import SelectForm from "../SelectForm/SelectForm";
import InputForm from "../InputForm/InputForm";

const CalendarUI = () => {
  const [value, onChange] = useState(new Date());
  const [showDesc, setShowDesc] = useState("");
  const [apiData, setApiData] = useState(null);
  let checkdate: any = moment().format(moment.HTML5_FMT.DATE);
  const [month, setMonth] = useState(Number(checkdate.split("-")[1]));
  const [year, setYear] = useState(Number(checkdate.split("-")[0]));
  const [resourceAllocatedOptions, setResourceAllocatedOptions] = useState<any>(
    []
  );
  const { EmployeeId, RoleId } = getContext();
  const RoleIdArray = RoleId.split(",");
  const [resourceAllocated, setResourceAllocated] = useState<any>({
    value: Number(EmployeeId),
  });
  const [formError, setFormError] = useState({});
  const [leaveBalance, setLeaveBalance] = useState(0);

  const [counts, setCounts] = useState({
    "full day approved leave": 0,
    "first half day approved leave": 0,
    "second half day approved leave": 0,
    "applied leave": 0,
    holiday: 0,
    weekend: 0,
    notfilled: 0,
    full: 0,
    discrepancy: 0,
  });

  let formErrorObj = {};

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "resourceAllocated") {
      setResourceAllocated(event);
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

  const getData = async () => {
    const obj = {
      EmployeeId: resourceAllocated.value,
      Month: Number(month),
      Year: Number(year),
    };
    const { data } = await APICall(getCalendarData, "POST", obj);
    await data.map(
      (ele) =>
        (ele.date = new Date(moment(ele.date).format(moment.HTML5_FMT.DATE)))
    );
    setApiData(data);

    //count
    for (let key in counts) {
      let count = data.filter((obj) => obj.status === key.toString()).length;
      setCounts((prev) => ({ ...prev, [key]: count }));
    }
  };

  const getEmployeeLeave = async () => {
    const { data } = await APICall(getEmployeeAvailableLeaveBalance, "POST", {
      EmployeeId: resourceAllocated.value,
    });
    if (data > 0) {
      setLeaveBalance(data);
    } else {
      setLeaveBalance(0);
    }
  };

  const getCalenderDataOnMonthChange = async (selectedMonth, selectedYear) => {
    const obj = {
      EmployeeId: resourceAllocated.value,
      Month: Number(selectedMonth),
      Year: Number(selectedYear),
    };
    const { data } = await APICall(getCalendarData, "POST", obj);
    await data.map(
      (ele) =>
        (ele.date = new Date(moment(ele.date).format(moment.HTML5_FMT.DATE)))
    );
    setApiData(data);

    //count
    for (let key in counts) {
      let count = data.filter((obj) => obj.status === key.toString()).length;
      setCounts((prev) => ({ ...prev, [key]: count }));
    }
  };

  useEffect(() => {
    resourceApiCall();
  }, []);

  useEffect(() => {
    getData();
    getEmployeeLeave();
  }, [resourceAllocated]);

  const tileContent = ({ activeStartDate, date, view }) => {
    let tempApiData = [...apiData];
    // if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
    //   return (
    //     <p>
    //       <FaHourglassHalf color="orange" />
    //     </p>
    //   );
    // }
    if (
      view === "month" &&
      tempApiData.find((ele) => ele.date.getDate() === date.getDate())
    ) {
      let status = tempApiData.find(
        (ele) => ele.date.getDate() === date.getDate()
      ).status;
      switch (status) {
        case "full day approved leave":
          return (
            <p>
              <FaCalendarPlus color="blue" />
            </p>
          );
        case "first half day approved leave":
          return (
            <p>
              <FaCalendarPlus color="aqua" />
            </p>
          );
        case "second half day approved leave":
          return (
            <p>
              <FaCalendarPlus color="aqua" />
            </p>
          );
        // case "first half day approved leave and discrepancy":
        //   return (
        //     <p>
        //       <FaCalendarPlus color="blue" />{" "}<FaCheckCircle color="yellow" />
        //     </p>
        //   );
        // case "second half day approved leave and discrepancy":
        //   return (
        //     <p>
        //       <FaCalendarPlus color="blue" />{" "}<FaCheckCircle color="yellow" />
        //     </p>
        //   );
        case "applied leave":
          return (
            <p>
              <FaCalendarPlus color="orange" />
            </p>
          );
        case "holiday":
          return (
            <p>
              <FaPowerOff color="grey" />
            </p>
          );
        case "weekend":
          return (
            <p>
              <FaMinusCircle color="maroon" />
            </p>
          );
        case "notfilled":
          return (
            <p>
              <FaTimesCircle color="red" />
            </p>
          );
        case "full":
          return (
            <p>
              <FaCheckCircle color="green" />
            </p>
          );
        case "discrepancy":
          return (
            <p>
              <FaCheckCircle color="yellow" />
            </p>
          );
        case "today":
          return (
            <p>
              <FaHourglassHalf color="orange" />
            </p>
          );
        default:
          return null;
      }
    }
  };

  const onMonthChange = async ({ action, activeStartDate, value, view }) => {
    if (view === "month") {
      let currentMonthFirstDate: any = moment(new Date(activeStartDate)).format(
        moment.HTML5_FMT.DATE
      );
      let selectedMonth = Number(currentMonthFirstDate.split("-")[1]);
      let selectedYear = Number(currentMonthFirstDate.split("-")[0]);
      setMonth(Number(currentMonthFirstDate.split("-")[1]));
      setYear(Number(currentMonthFirstDate.split("-")[0]));
      await getCalenderDataOnMonthChange(selectedMonth, selectedYear);
    }
  };

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
        if (tempObj.value == resourceAllocated.value) {
          setResourceAllocated(tempObj);
        }
        employeeArray.push(tempObj);
      });
      setResourceAllocatedOptions(employeeArray);
    }
  };

  //will use in future//
  const onDateChange = (date) => {
    let temp = { ...apiData };
    if (date.getMonth() === temp.month) {
      let ele = temp.days.find((ele) => ele.date.getDate() === date.getDate());
      if (ele !== undefined) {
        setShowDesc(
          `Status is ${ele.status} & description is ${ele.description}`
        );
      } else {
        setShowDesc("");
      }
      onChange(date);
    }
  };
  //will use in future//

  return (
    <>
      {apiData && (
        <>
          <Heading title={"Calendar"} />
          <section className="main_content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      Employee Selected<sup>*</sup>
                    </label>
                    <SelectForm
                      options={resourceAllocatedOptions}
                      placeholder="Select"
                      isDisabled={
                        RoleIdArray.includes("3") ||
                        RoleIdArray.includes("4") ||
                        RoleIdArray.includes("6")
                          ? false
                          : true
                      }
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
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Leave Balance</label>
                    <InputForm
                      placeholder={"Leave days"}
                      isDisabled={true}
                      textArea={false}
                      value={leaveBalance}
                      onChange={(e) => {}}
                      className="numRight"
                      type="number"
                      onKeyPress={(event) => {
                        if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <p style={{ color: "red" }}>
                      {formError["leaveBalance_isEmpty"]}
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <Calendar
                    onChange={() => {}} //onDateChange
                    value={value}
                    tileContent={tileContent}
                    showNeighboringMonth={false}
                    onActiveStartDateChange={onMonthChange}
                    minDetail="century"
                    minDate={new Date(new Date().getFullYear(), 0, 1)}
                    maxDate={new Date(new Date().getFullYear() + 1, 0, 31)}
                  />
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <Card>
                    <Card.Body>
                      <Card.Title>Calendar Legends</Card.Title>
                      <table className="table table-bordered table_grid">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Today</td>
                            <td>
                              <FaHourglassHalf color="orange" />
                            </td>
                            <td>1</td>
                          </tr>
                          <tr>
                            <td>Full day</td>
                            <td>
                              <FaCheckCircle color="green" />
                            </td>
                            <td>{counts.full}</td>
                          </tr>
                          <tr>
                            <td>Discrepancy</td>
                            <td>
                              <FaCheckCircle color="yellow" />
                            </td>
                            <td>{counts.discrepancy}</td>
                          </tr>
                          <tr>
                            <td>Full Day Approved Leave</td>
                            <td>
                              <FaCalendarPlus color="blue" />
                            </td>
                            <td>{counts["full day approved leave"]}</td>
                          </tr>
                          <tr>
                            <td>Half Day Approved Leave</td>
                            <td>
                              <FaCalendarPlus color="aqua" />
                            </td>
                            <td>
                              {counts["first half day approved leave"] +
                                counts["second half day approved leave"]}
                            </td>
                          </tr>
                          <tr>
                            <td>Applied Leave</td>
                            <td>
                              <FaCalendarPlus color="orange" />
                            </td>
                            <td>{counts["applied leave"]}</td>
                          </tr>
                          <tr>
                            <td>Holiday</td>
                            <td>
                              <FaPowerOff color="grey" />{" "}
                            </td>
                            <td>{counts.holiday}</td>
                          </tr>
                          <tr>
                            <td>Not filled</td>
                            <td>
                              <FaTimesCircle color="red" />
                            </td>
                            <td>{counts.notfilled}</td>
                          </tr>
                          <tr>
                            <td>Weekend</td>
                            <td>
                              <FaMinusCircle color="maroon" />
                            </td>
                            <td>{counts.weekend}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      {/* <h4 className="text-center mb-1">{value.toDateString()}</h4>
      {showDesc && <h4 className="text-center">{showDesc.toString()}</h4>} */}
    </>
  );
};

export default CalendarUI;
