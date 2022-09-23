import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import Heading from "../../../Components/Heading/Heading";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  GetDropDownList,
  getLeaveRequestMasterGridData,
  leaveExportToExcel,
} from "../../../Helpers/API/APIEndPoints";
import moment from "moment";
import { getContext, LoaderContext } from "../../../Helpers/Context/Context";
import axios from "axios";
// Import to download excel file
import fileDownload from "js-file-download";
import { TextField, Tooltip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import { debounceSearchRender } from "mui-datatables";

const LeaveRequestMaster = () => {
  let navigate = useNavigate();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [LeaveRequestMasterData, setLeaveRequestMasterData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);
  const [roleForData, setRoleForData] = useState(0);
  const { EmployeeId, RoleId } = getContext();
  const RoleIdArray = RoleId.split(",");
  const [employeeOptions, setEmployeeOptions] = useState<any>([]);
  const [filterData, setFilterData] = useState(false);
  const [filterObj, setFilterObj] = useState<any>({
    approver: null,
    requestor: null,
    fromDate: null,
    toDate: null,
    requestStatus: null,
  });

  const getAllEmployees = async () => {
    let postObject = {
      searchFor: "employee",
      searchValue: 1,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data != undefined || data != null) {
      let employees = [];
      await data.map((approver: any) => {
        let tempObj = {
          eid: approver.eid,
          value: approver.id,
          label: approver.name,
        };
        employees.push(tempObj);
      });

      setEmployeeOptions(employees);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  useEffect(() => {
    if (
      RoleIdArray.includes("3") ||
      RoleIdArray.includes("4") ||
      RoleIdArray.includes("6")
    ) {
      setRoleForData(1); // 1 to get all request
    } else if (RoleIdArray.includes("2")) {
      setRoleForData(2); // 2 to get all request only for approver & self leave
    } else if (RoleIdArray.includes("1")) {
      setRoleForData(3); // 3 to get all request only for requestor
    }
  }, [RoleIdArray]);

  const workday_count = (start, end) => {
    var first = start.clone().endOf("week"); // end of first week
    var last = end.clone().startOf("week"); // start of last week
    var days = (last.diff(first, "days") * 5) / 7; // this will always multiply of 7
    var wfirst = first.day() - start.day(); // check first week
    if (start.day() == 0) --wfirst; // -1 if start with sunday
    var wlast = end.day() - last.day(); // check last week
    if (end.day() == 6) --wlast; // -1 if end with saturday
    return wfirst + Math.floor(days) + wlast; // get the total
  };

  const getLeaveRequestMasterData = async () => {
    showLoader();
    let requestParams = {
      start: start,
      pageSize: pageSize,
      sortColumn: sortColumn,
      sortDirection: sortDirection,
      searchText: searchText,
      RoleId: roleForData,
      EmployeeId: Number(EmployeeId),
      approverId: filterObj.approver ? filterObj.approver.value : 0,
      requestorId: filterObj.requestor ? filterObj.requestor.value : 0,
      requestStatus: filterObj.requestStatus
        ? filterObj.requestStatus.value
        : 0,
      fromDate: filterObj.fromDate ? filterObj.fromDate : undefined,
      toDate: filterObj.toDate ? filterObj.toDate : undefined,
    };
    const { data } = await APICall(
      getLeaveRequestMasterGridData,
      "POST",
      requestParams
    );

    await data.leaveRequestsMasterData.forEach((ele: any) => {
      ele.fromDate = moment(ele.fromDate).format("DD-MM-yyyy");
      ele.toDate = moment(ele.toDate).format("DD-MM-yyyy");
      // let leaveDays: any;
      // leaveDays = workday_count(FromDate, ToDate);
      // ele.leaveDays = leaveDays;
    });
    setCount(data.count);
    setLeaveRequestMasterData(data.leaveRequestsMasterData);
    hideLoader();
  };

  const ExportToExcel = () => {
    let requestParams = {
      start: 0,
      pageSize: count,
      sortColumn: sortColumn,
      sortDirection: sortDirection,
      searchText: searchText,
      RoleId: roleForData,
      EmployeeId: Number(EmployeeId),
      approverId: filterObj.approver ? filterObj.approver.value : 0,
      requestorId: filterObj.requestor ? filterObj.requestor.value : 0,
      requestStatus: filterObj.requestStatus
        ? filterObj.requestStatus.value
        : 0,
      fromDate: filterObj.fromDate ? filterObj.fromDate : undefined,
      toDate: filterObj.toDate ? filterObj.toDate : undefined,
    };

    axios
      .request({
        responseType: "blob",
        method: "POST",
        url: leaveExportToExcel,
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
          `WoW_Leaves-` +
            `${moment(new Date()).format(moment.HTML5_FMT.DATE)}` +
            `.xlsx`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (roleForData !== 0) {
      getLeaveRequestMasterData();
    }
  }, [start, sortColumn, sortDirection, searchText, roleForData, filterData]);

  const gridColumns = [
    {
      name: "id",
      label: "Id",
      options: {
        display: false,
      },
    },
    {
      name: "approverName",
      label: "Approver",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "requesterName",
      label: "Requestor",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    // {
    //   name: "leavesReson",
    //   label: "Reason",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    {
      name: "fromDate",
      label: "From Date",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "toDate",
      label: "To Date",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "leaveDays",
      label: "Leave Days",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "requestStatus",
      label: "Status",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta) => {
          if (value === 1) {
            return "Approved";
          } else if (value === 2) {
            return "Rejected";
          } else if (value === 3) {
            return "Pending";
          } else if (value === 4) {
            return "Cancelled";
          }
        },
      },
    },
    // {
    //   name: "remark",
    //   label: "Remark",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    {
      name: "",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          // console.log(tableMeta.tableData[tableMeta.rowIndex]);
          let approverId = tableMeta.tableData[tableMeta.rowIndex].approverId;
          let requestorId = tableMeta.tableData[tableMeta.rowIndex].requestorId;
          let requestStatus =
            tableMeta.tableData[tableMeta.rowIndex].requestStatus;

          let id = tableMeta.tableData[tableMeta.rowIndex].id;

          if (requestorId === Number(EmployeeId) && requestStatus === 3) {
            return (
              <>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("edit", { state: { id, role: "self" } });
                  }}
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </a>
              </>
            );
          } else if (approverId === Number(EmployeeId) && requestStatus === 3) {
            return (
              <>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("edit", { state: { id, role: "approver" } });
                  }}
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </a>
              </>
            );
          } else if (
            requestorId === Number(EmployeeId) &&
            requestStatus === 1
          ) {
            return (
              <>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("edit", { state: { id, role: "self" } });
                  }}
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </a>
              </>
            );
          } else {
            return (
              <>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("edit", { state: { id, role: "viewer" } });
                  }}
                >
                  <i
                    className="fa fa-eye text-secondary"
                    aria-hidden="true"
                  ></i>
                </a>
              </>
            );
          }
        },
      },
    },
  ];

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
    customSearchRender: debounceSearchRender(500),
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

  const handleFilterChange = async (event, name) => {
    if (
      name === "approver" ||
      name === "requestor" ||
      name === "requestStatus"
    ) {
      setFilterObj((prev) => ({ ...prev, [name]: event }));
    } else {
      setFilterObj((prev) => ({
        ...prev,
        [name]: moment(event).format(moment.HTML5_FMT.DATE),
      }));
    }
  };
  const onClickFunction = async (action) => {
    if (action === "reset") {
      setFilterObj({
        approver: null,
        requestor: null,
        fromDate: null,
        toDate: null,
        requestStatus: null,
      });
    }
    setFilterData(!filterData);
  };

  const statusDropdownOptions = [
    { label: "Approved", value: 1 },
    { label: "Cancelled", value: 4 },
    { label: "Pending", value: 3 },
    { label: "Rejected", value: 2 },
  ];
  return (
    <>
      <Heading title={"Request Leave /Report Absence"} />
      <div className="px-3 pt-3 d-flex justify-content-end">
        <Tooltip title="Export to excel">
          <button
            onClick={() => ExportToExcel()}
            className="btn btn-secondary mr-2"
          >
            <i className="fa-solid fa-file-arrow-down"></i>
          </button>
        </Tooltip>
        <button onClick={() => navigate("edit")} className="btn btn-primary">
          + Create
        </button>
      </div>
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Approver</label>
                <SelectForm
                  options={employeeOptions}
                  placeholder="Select"
                  value={filterObj.approver}
                  onChange={(event) => handleFilterChange(event, "approver")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Requestor</label>
                <SelectForm
                  options={employeeOptions}
                  placeholder="Select"
                  value={filterObj.requestor}
                  onChange={(event) => handleFilterChange(event, "requestor")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Status</label>
                <SelectForm
                  options={statusDropdownOptions}
                  placeholder="Select"
                  value={filterObj.requestStatus}
                  onChange={(event) =>
                    handleFilterChange(event, "requestStatus")
                  }
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 align-self-center">
              <div className="form-group">
                <label className="d-block">From Date</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From date"
                    value={filterObj.fromDate}
                    onChange={(e) => handleFilterChange(e, "fromDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 align-self-center">
              <div className="form-group">
                <label className="d-block">To Date</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To date"
                    value={filterObj.toDate}
                    onChange={(e) => handleFilterChange(e, "toDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 align-self-center">
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
              </div>
            </div>
          </div>
        </div>
      </section>
      <DynamicGrid
        options={options}
        data={LeaveRequestMasterData}
        columns={gridColumns}
      />
    </>
  );
};
export default LeaveRequestMaster;
