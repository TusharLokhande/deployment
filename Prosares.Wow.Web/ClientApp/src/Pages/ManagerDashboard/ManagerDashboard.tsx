import React, { useContext, useEffect, useState } from "react";
import DynamicGrid from "../../Components/DynamicGrid/DynamicGrid";
import Heading from "../../Components/Heading/Heading";
import { APICall } from "../../Helpers/API/APICalls";
import {
  ExportToExcelApi,
  GetDropDownList,
  getManagerDashboardData,
} from "../../Helpers/API/APIEndPoints";
import { getContext, LoaderContext } from "../../Helpers/Context/Context";
import { useLocation, useNavigate } from "react-router-dom";
import SelectForm from "../../Components/SelectForm/SelectForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Tooltip } from "@mui/material";
import moment from "moment";
import axios from "axios";

// Import to download excel file
import fileDownload from "js-file-download";

function ManagerDashboard() {
  const location = useLocation();
  let navigate = useNavigate();
  const [managerDashboardData, setManagerDashboardData] = useState([]);
  const [Engagement, setEngagement] = useState<any>([]);
  const [EngagementOptions, setEngagementOptions] = useState<any>([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);
  const [Role, setRole] = useState(null);
  const [fromDate, setFromDate] = React.useState<any>(null);
  const [toDate, setToDate] = React.useState<any>(null);
  const [statusOptions, setStatusOptions] = useState<any>([]);
  const [status, setStatus] = useState<any>({});
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { EmployeeId, RoleId } = getContext();
  const [isTask, setIsTask] = React.useState<any>(location.state);
  const context = getContext();
  const [columns, setColumns] = React.useState<any>([]);
  const [reset, setReset] = React.useState<any>(false);

  const gridColumns = [
    {
      name: "id",
      label: "Id",
      options: {
        display: false,
      },
    },
    {
      name: "engagementString",
      label: "Engagement",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "taskTitle",
      label: "Title",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "assignedToString",
      label: "Assigned To",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "statusString",
      label: "Status",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "hoursAssigned",
      label: "Assigned Hrs.",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "hoursSpent",
      label: "Hrs. Spent",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "createdDate",
      label: "Date",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
  ];
  const gridColumnsForTicket = [
    {
      name: "id",
      label: "Id",
      options: {
        display: false,
      },
    },
    {
      name: "engagementString",
      label: "Engagement",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "ticketTitle",
      label: "Title",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "assignedToString",
      label: "Assigned To",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "statusString",
      label: "Status",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "hoursAssigned",
      label: "Assigned Hrs.",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "hoursSpent",
      label: "Hrs. Spent",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "createdDate",
      label: "Date",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
  ];
  useEffect(() => {
    (async () => {
      showLoader();
      let RoleForData;
      var isManager = RoleId.includes("3");
      if (isManager) {
        RoleForData = 2;
      } else {
        var isEmanager = RoleId.includes("2");
        if (isEmanager) {
          RoleForData = 1;
        } else {
          RoleForData = 3;
        }
      }

      var fDate;
      if (fromDate !== null) {
        fDate = moment(fromDate).format(moment.HTML5_FMT.DATE);
      }
      var tDate;
      if (toDate !== null) {
        tDate = moment(toDate).format(moment.HTML5_FMT.DATE);
      }

      let requestParams = {
        Role: RoleForData,
        UserId: Number(EmployeeId),
        Type: location.state === "true" ? "task" : "ticket",
        start: start,
        pageSize: pageSize,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
        searchText: searchText,
        engagement: Engagement ? Engagement : null,
        fromDate: fDate,
        toDate: tDate,
        status: status && status.value ? status.value : 0,
        isExcel: false,
      };

      const data = await APICall(
        getManagerDashboardData,
        "POST",
        requestParams
      );

      if (location.state === "true") {
        await data.data.taskData.forEach((ele: any) => {
          ele.createdDate = moment(ele.createdDate).format("DD-MM-yyyy");
        });
        await setManagerDashboardData(data.data.taskData);
        await setColumns(gridColumns);
      } else {
        await data.data.ticketData.forEach((ele: any) => {
          ele.createdDate = moment(ele.createdDate).format("DD-MM-yyyy");
        });
        await setManagerDashboardData(data.data.ticketData);
        await setColumns(gridColumnsForTicket);
      }
      hideLoader();
      await setCount(data.data.count);
    })();
  }, [start, sortColumn, sortDirection, searchText, location.state, reset]);

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
    search: true,
    onChangeRowsPerPage: (num) => {
      //   setLimit(num);
      //   setNxtPgInfo("");
      //   setPrevPgInfo("");
      //   setIsPrevOrNext("");
    },
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

  const CommonDropdownFunction = async (searchFor, searchValue) => {
    let postObject = {
      searchFor: searchFor,
      searchValue: searchValue,
    };

    const { data } = await APICall(GetDropDownList, "POST", postObject);

    return data;
  };

  useEffect(() => {
    onLoadAPI();
  }, [location, location.state]);

  const onLoadAPI = async () => {
    //Engagement Dropdown
    let RoleForData;
    var isManager = RoleId.includes("3");
    if (isManager) {
      RoleForData = 2;
    } else {
      var isEmanager = RoleId.includes("2");
      if (isEmanager) {
        RoleForData = 1;
      } else {
        RoleForData = 3;
      }
    }

    let EmployeeId = context.EmployeeId; //hardcoded
    var data;
    if (RoleForData == 1 || RoleForData == 3) {
      if (location.state === "true") {
        data = await CommonDropdownFunction(
          "engagementForEManager",
          EmployeeId
        );
      } else {
        data = await CommonDropdownFunction(
          "engagementForEManagerTicket",
          EmployeeId
        );
      }
    } else {
      if (location.state === "true") {
        data = await CommonDropdownFunction("engagementForManager", EmployeeId);
      } else {
        data = await CommonDropdownFunction(
          "engagementForManagerTicketForD",
          EmployeeId
        );
      }
    }

    if (data != undefined || data != null) {
      let engagementArray = [];

      await data.map((engagement) => {
        let tempObj;
        tempObj = {
          label: `${engagement.engagement}`,
          value: engagement.id,
        };

        engagementArray.push(tempObj);
      });

      setEngagementOptions(engagementArray);
    }

    //status dropdown
    (async () => {
      const { data } = await APICall(GetDropDownList, "post", {
        searchFor: "status",
        searchValue: location.state === "true" ? 1 : 2, //1 for task,2 for ticket
      });
      if (data !== null) {
        if (data.length > 0) {
          let statusArr = await data.map((ele) => ({
            value: ele.id,
            label: ele.value,
          }));
          setStatusOptions(statusArr);
        }
      }
    })();
  };
  const handleTextEvent = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "fromDate") {
      let date = event;
      await setFromDate(date);
    }
    if (apiFieldName === "toDate") {
      let date = event;
      await setToDate(date);
      //await getAutoPopulateData();
    }
  };

  const selectOnChange = (event: any, apiFieldName: any) => {
    if (apiFieldName === "Engagement") {
      setEngagement(event);
    }
    if (apiFieldName === "status") {
      setStatus(event);
    }
  };
  useEffect(() => {
    if (Engagement != null || Engagement != undefined) {
      setEngagement(Engagement);
    }
  }, [Engagement]);

  const onClickFunction = async (action) => {
    if (action === "Submit") {
      var fDate;
      if (fromDate !== null) {
        fDate = moment(fromDate).format(moment.HTML5_FMT.DATE);
      }
      var tDate;
      if (toDate !== null) {
        tDate = moment(toDate).format(moment.HTML5_FMT.DATE);
      }

      let RoleForData;
      var isManager = RoleId.includes("3");
      if (isManager) {
        RoleForData = 2;
      } else {
        var isEmanager = RoleId.includes("2");
        if (isEmanager) {
          RoleForData = 1;
        } else {
          RoleForData = 3;
        }
      }
      showLoader();
      let requestParams = {
        Role: RoleForData,
        UserId: Number(EmployeeId),
        Type: location.state === "true" ? "task" : "ticket",
        start: start,
        pageSize: pageSize,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
        searchText: "",
        engagement: Engagement ? Engagement : null,
        fromDate: fDate,
        toDate: tDate,
        status: status && status.value ? status.value : 0,
        isExcel: false,
      };

      const data = await APICall(
        getManagerDashboardData,
        "POST",
        requestParams
      );

      if (location.state === "true") {
        await data.data.taskData.forEach((ele: any) => {
          ele.createdDate = moment(ele.createdDate).format("DD-MM-yyyy");
        });
        setManagerDashboardData(data.data.taskData);
      } else {
        await data.data.ticketData.forEach((ele: any) => {
          ele.createdDate = moment(ele.createdDate).format("DD-MM-yyyy");
        });
        setManagerDashboardData(data.data.ticketData);
      }

      hideLoader();
      setCount(data.data.count);
    } else {
      setEngagement([]);
      setFromDate(null);
      setToDate(null);
      setSearchText("");
      setStatus({});
      setReset(!reset);
    }
  };
  const navigateTo = () => {
    if (location.state === "true") {
      navigate("TaskAssignment");
    } else {
      navigate("TicketAssignment");
    }
  };

  const ExportToExcel = async () => {
    var fDate;
    if (fromDate !== null) {
      fDate = moment(fromDate).format(moment.HTML5_FMT.DATE);
    }
    var tDate;
    if (toDate !== null) {
      tDate = moment(toDate).format(moment.HTML5_FMT.DATE);
    }

    let RoleForData;
    var isManager = RoleId.includes("3");
    if (isManager) {
      RoleForData = 2;
    } else {
      var isEmanager = RoleId.includes("2");
      if (isEmanager) {
        RoleForData = 1;
      } else {
        RoleForData = 3;
      }
    }

    let requestParams = {
      Role: RoleForData,
      UserId: Number(EmployeeId),
      Type: location.state === "true" ? "task" : "ticket",
      start: start,
      pageSize: pageSize,
      sortColumn: sortColumn,
      sortDirection: sortDirection,
      searchText: searchText,
      engagement: Engagement ? Engagement : null,
      fromDate: fDate,
      toDate: tDate,
      status: status && status.value ? status.value : 0,
      isExcel: true,
    };

    axios
      .request({
        responseType: "blob",
        method: "POST",
        url: ExportToExcelApi,
        data: requestParams,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
        },
      })
      .then((response) => {
        fileDownload(
          response.data,
          `${location.state === "true" ? "Task-" : "Ticket-"}` +
            `${moment(new Date()).format(moment.HTML5_FMT.DATE)}` +
            `.xlsx`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Heading
        title={location.state == "true" ? "Task Dashboard" : "Ticket Dashboard"}
      />
      {(RoleId.includes("2") ||
        RoleId.includes("3") ||
        RoleId.includes("6")) && (
        <div className="px-3 pt-3 d-flex justify-content-end gap-2">
          <button onClick={() => navigateTo()} className="btn btn-primary">
            + Create
          </button>
        </div>
      )}

      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Engagement </label>
                <SelectForm
                  options={EngagementOptions}
                  placeholder="Select"
                  isDisabled={false}
                  value={Engagement}
                  onChange={(event) => selectOnChange(event, "Engagement")}
                  isMulti={true}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 align-self-end">
              <div className="form-group">
                <label>From date</label>
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
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 align-self-end">
              <div className="form-group">
                <label>To date</label>
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
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Status</label>
                <SelectForm
                  options={statusOptions}
                  placeholder="Select"
                  isDisabled={false}
                  value={status}
                  onChange={(event) => selectOnChange(event, "status")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 align-self-center">
              <div>
                <button
                  onClick={() => onClickFunction("reset")}
                  className="btn btn-reset ml-1"
                >
                  Reset
                </button>
                <button
                  style={{ background: "#96c61c" }}
                  onClick={() => onClickFunction("Submit")}
                  className="btn btn-save ml-1"
                >
                  Submit
                </button>
                <Tooltip title="Export to excel">
                  <button
                    onClick={() => ExportToExcel()}
                    className="btn btn-secondary ml-2"
                  >
                    <i className="fa-solid fa-file-arrow-down"></i>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isTask === "true" ? (
        <>
          <DynamicGrid
            options={options}
            data={managerDashboardData}
            columns={columns}
          />
        </>
      ) : isTask === "false" ? (
        <>
          <DynamicGrid
            options={options}
            data={managerDashboardData}
            columns={columns}
          />
        </>
      ) : null}
    </>
  );
}

export default ManagerDashboard;
