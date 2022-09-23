import React, { useContext, useEffect, useState } from "react";
import Accordian from "./Accordian/Accordian";
import { TaskListArrayData } from "../../Helpers/json/TaskListData";
import {
  getDashboardData,
  GetDropDownList,
} from "../../Helpers/API/APIEndPoints";
import { APICall } from "../../Helpers/API/APICalls";
import Accordian2 from "./Accordian/Accordian2";
import Accordian3 from "./Accordian/Accordian3";
import { format } from "date-fns";
import { getContext, LoaderContext } from "../../Helpers/Context/Context";
import Bubble from "../../Layout/Bubble/Bubble";

function Homescreen() {
  const [dashboardData, setDashboardData] = useState([]);
  const [futureDates, setFutureDates] = useState([]);
  const [taskStatusDropdown, setTaskStatusDropdown] = useState([]);
  const [ticketStatusDropdown, setTicketStatusDropdown] = useState([]);
  const [natureOfIssueDropdown, setNatureOfIssueDropdown] = useState([]);
  const [totalReportedHoursToday, setTotalReportedHoursToday] = useState(0);
  const { EmployeeId } = getContext();
  const { showLoader, hideLoader } = useContext(LoaderContext);

  //group by func
  function groupArrayOfObjects(list, key) {
    return list.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  useEffect(() => {
    (async () => {
      const { data } = await APICall(GetDropDownList, "post", {
        searchFor: "status",
        searchValue: 1,
      });
      if (data !== null) {
        if (data.length > 0) {
          setTaskStatusDropdown(data);
          //   [
          //     {
          //         "id": 1,
          //         "value": "Not Started",

          //     },
          //     {
          //         "id": 3,
          //         "value": "In Progress",

          //     },
          //     {
          //         "id": 4,
          //         "value": "On Hold",

          //     },
          //     {
          //         "id": 5,
          //         "value": "Completed",

          //     }
          // ]
        }
      }
    })();

    (async () => {
      const { data } = await APICall(GetDropDownList, "post", {
        searchFor: "status",
        searchValue: 2,
      });
      if (data !== null) {
        if (data.length > 0) {
          setTicketStatusDropdown(data);
        }
      }
    })();

    (async () => {
      const { data } = await APICall(GetDropDownList, "post", {
        searchFor: "ticketType",
        searchValue: 1,
      });
      if (data !== null) {
        if (data.length > 0) {
          setNatureOfIssueDropdown(data);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (ticketStatusDropdown.length !== 0 && taskStatusDropdown.length !== 0)
      (async () => {
        showLoader();
        let { data } = await APICall(getDashboardData, "Post", {
          Userid: EmployeeId,
        });
        hideLoader();
        if (data !== null) {
          if (data.length > 0) {
            data.forEach((ele) => {
              ele.plannedStartDate = new Date(ele.plannedStartDate);
              ele.plannedEndDate = new Date(ele.plannedEndDate);

              if (ele.rType === "Task") {
                ele.status = taskStatusDropdown.find(
                  (element) => element.id === ele.status
                );
              } else {
                ele.status = ticketStatusDropdown.find(
                  (element) => element.id === ele.status
                );
                ele.ticketNatureOfIssue = natureOfIssueDropdown.find(
                  (element) => element.value === ele.ticketNatureOfIssue
                );
              }
            });
            let finalArr: any = new Set();
            let first = [...data];
            first = first
              .filter(
                (ele) =>
                  ele.plannedEndDate < new Date() ||
                  ele.plannedEndDate === new Date()
              )
              .sort((a, b) => a.plannedEndDate - b.plannedEndDate);
            let second = [...data];
            second = second
              .filter(
                (ele) =>
                  ele.plannedStartDate < new Date() ||
                  ele.plannedStartDate.toDateString() ===
                    new Date().toDateString()
              )
              .sort((a, b) => a.plannedStartDate - b.plannedStartDate);
            let third = [...data];
            third = third
              .filter((ele) => ele.plannedStartDate > new Date())
              .sort((a, b) => a.plannedStartDate - b.plannedStartDate);
            // third.forEach((element) => {
            //   if (element.rType === "Task") {
            //     // element.fStatus = 3;
            //     // // element.fnatureOfIssure = null;
            //     // // element.fLinkedTicket = null;
            //     // element.thoursSpent = "";
            //     // element.fRemarks = "";
            //   } else {
            //     element.fStatus = 3;
            //     element.fnatureOfIssure = null;
            //     element.fLinkedTicket = null;
            //     element.thoursSpent = "";
            //     element.fRemarks = "";
            //   }
            // });

            let groupedFutureDates = groupArrayOfObjects(
              third,
              "plannedStartDate"
            );

            groupedFutureDates = Object.values(groupedFutureDates);

            setFutureDates(groupedFutureDates);

            finalArr = new Set([...first, ...second]);
            finalArr = Array.from(finalArr);

            // finalArr.forEach((element) => {
            //   if (element.rType === "Task") {
            //     // element.fStatus = taskStatusDropdown.find(
            //     //   (ele) => ele.id === element.status
            //     // );
            //     // // element.fnatureOfIssure = null;
            //     // // element.fLinkedTicket = null;
            //     // element.thoursSpent = "";
            //     // element.fRemarks = "";
            //   } else {
            //     element.fStatus = ticketStatusDropdown.find(
            //       (ele) => ele.id === 6
            //     );
            //     element.ticketNatureOfIssue = natureOfIssueDropdown.find(
            //       (ele) => ele.value == element.ticketNatureOfIssue
            //     );
            //     element.fLinkedTicket = null;
            //     element.thoursSpent = "";
            //     element.fRemarks = "";
            //   }
            // });

            setDashboardData(finalArr);
          }
        }
      })();
  }, [ticketStatusDropdown, taskStatusDropdown, natureOfIssueDropdown]);

  useEffect(() => {
    if (dashboardData.length > 0) {
      setTotalReportedHoursToday(
        dashboardData.reduce(
          (sum, data) => (sum = sum + data.todayHoursSpent),
          0
        )
      );
    }
  }, [dashboardData]);

  return (
    <>
      <div className="container-fluid">
        <section className="date">
          <div className="p-2">
            <div className="">
              <span>
                <i className="fa fa-calendar-alt mr-1" aria-hidden="true"></i>{" "}
                {format(new Date(), "dd-MMM-yy")}
              </span>
            </div>
          </div>
        </section>

        {dashboardData.length > 0 && (
          <section className="reported-hours">
            <div className="p-2">
              <div className="col-lg-12 p-0">
                <span>Total Reported hours</span>
                <span className="float-right">
                  {/* {dashboardData.map((data) => data.hoursSpent)} */}
                  {totalReportedHoursToday}
                  /8.5H
                  {/* {dashboardData.reduce(
                    (sum, data) => (sum = sum + data.hoursAssigned),
                    0
                  )} */}
                </span>
              </div>
            </div>
          </section>
        )}

        {dashboardData.length > 0 ? (
          dashboardData.map((data, index, arr) => {
            if (data.rType === "Task") {
              // This is task accordian component
              return (
                <div key={index}>
                  <Accordian2
                    statusDropdown={taskStatusDropdown}
                    data={data}
                    setDashboardData={setDashboardData}
                    totalReportedHoursToday={totalReportedHoursToday}
                  />
                </div>
              );
            } else {
              // This is ticket accordian component
              return (
                <div key={index}>
                  <Accordian3
                    statusDropdown={ticketStatusDropdown}
                    natureOfIssueDropdown={natureOfIssueDropdown}
                    data={data}
                    setDashboardData={setDashboardData}
                    totalReportedHoursToday={totalReportedHoursToday}
                  />
                </div>
              );
            }
          })
        ) : (
          <h3>No task or ticket assigned!</h3>
        )}

        {futureDates.length > 0 &&
          futureDates.map((data, index) => (
            <React.Fragment key={index}>
              <section className="date">
                <div className="p-2">
                  <div className="">
                    <span>
                      <i
                        className="fa fa-calendar-alt mr-1"
                        aria-hidden="true"></i>{" "}
                      {format(new Date(data[0].plannedStartDate), "dd-MMM-yy")}
                    </span>
                  </div>
                </div>
              </section>
              {data.map((datax, index) => (
                <div key={index}>
                  {datax.rType === "Task" ? (
                    <Accordian2
                      statusDropdown={taskStatusDropdown}
                      data={datax}
                      setDashboardData={setDashboardData}
                      totalReportedHoursToday={totalReportedHoursToday}
                      futureDate
                    />
                  ) : (
                    <Accordian3
                      statusDropdown={ticketStatusDropdown}
                      natureOfIssueDropdown={natureOfIssueDropdown}
                      data={datax}
                      setDashboardData={setDashboardData}
                      totalReportedHoursToday={totalReportedHoursToday}
                      futureDate
                    />
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}

        {/* {TaskListArrayData[0].ticketList.map((taskList, index) => {
          return (
            <div key={index}>
              <Accordian data={taskList} />
            </div>
          );
        })} */}
        <Bubble />
      </div>
    </>
  );
}

export default Homescreen;
