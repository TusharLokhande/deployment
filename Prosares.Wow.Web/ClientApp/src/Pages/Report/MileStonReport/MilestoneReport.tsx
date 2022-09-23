import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";

import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import Heading from "../../../Components/Heading/Heading";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  getCapacityUtilizationCustomerData,
  getCapacityUtilizationEngagementTypeOption,
  getMileReportData,
  ExportToExcelMilestoneReport,
} from "../../../Helpers/API/APIEndPoints";
import { Tooltip } from "@mui/material";
import { LoaderContext } from "../../../Helpers/Context/Context";
import axios from "axios";
import fileDownload from "js-file-download";

const MilestoneReport = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customerSelectData, setCustomerSelectData] = useState([]);

  const [engagementTypeOptions, setEngagementTypeOptions] = useState([]);
  const [engagementTypeSelectedData, setEngagementTypeSelectedData] = useState(
    []
  );
  const [gridData, setGridData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const { showLoader, hideLoader } = useContext(LoaderContext);

  useEffect(() => {
    GetCustomerData();
    GetEngagementTypeData();
    let customers = ConvertArrayToString(customerSelectData);
    let engagementTypes = ConvertArrayToString(engagementTypeSelectedData);
    let obj = {
      Customer: customers,
      EngagementType: engagementTypes,
      FromDate:
        fromDate === null
          ? null
          : moment(fromDate).format(moment.HTML5_FMT.DATE),
      ToDate:
        toDate === null ? null : moment(fromDate).format(moment.HTML5_FMT.DATE),
      sortColumn,
      sortOrder: sortDirection,
      searchText,
      pageSize,
      start,
      count,
    };
    GetGridData(obj);
  }, []);

  useEffect(() => {
    GetCustomerData();
    GetEngagementTypeData();
    let customers = ConvertArrayToString(customerSelectData);
    let engagementTypes = ConvertArrayToString(engagementTypeSelectedData);
    let obj = {
      Customer: customers,
      EngagementType: engagementTypes,
      FromDate:
        fromDate === null
          ? null
          : moment(fromDate).format(moment.HTML5_FMT.DATE),
      ToDate:
        toDate === null ? null : moment(fromDate).format(moment.HTML5_FMT.DATE),
      sortColumn,
      SortOrder: sortDirection,
      searchText,
      pageSize,
      start,
      count,
    };
    GetGridData(obj);
  }, [sortDirection, sortColumn, searchText, start, pageSize]);

  const GetEngagementTypeData = async () => {
    let { data } = await APICall(
      getCapacityUtilizationEngagementTypeOption,
      "POST",
      {}
    );
    let options = [];
    data.map((item, index) => {
      options.push({ value: item.name, label: item.name, id: item.id });
    });
    options.sort((a, b) => a.value.localeCompare(b.value));
    setEngagementTypeOptions(options);
  };

  const GetCustomerData = async () => {
    let { data } = await APICall(
      getCapacityUtilizationCustomerData,
      "POST",
      {}
    );

    let options = [];

    data.map((item, index) => {
      options.push({ value: item.name, label: item.name, id: item.id });
    });

    options.sort((a, b) => a.value.localeCompare(b.value));

    setCustomerOptions(options);
  };

  const GetGridData = async (obj) => {
    showLoader();
    console.log(obj);
    const { data } = await APICall(getMileReportData, "POST", obj);
    let arr = [];
    arr = [...data];

    setGridData(data);
    console.log(data);
    if (arr.length > 0) {
      setCount(arr[0].totalCount);
    }

    hideLoader();
  };

  const SelectOnChange = (event, apiField) => {
    if (apiField === "customer") {
      setCustomerSelectData(event);
    }

    if (apiField === "engagementType") {
      setEngagementTypeSelectedData(event);
    }

    if (apiField === "fromDate") {
      setFromDate(event);

      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["fromDate_isEmpty"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["fromDate_isEmpty"]: "From date can not be empty",
        }));
      }
    }
    if (apiField === "toDate") {
      setToDate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["toDate_isEmpty"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["toDate_isEmpty"]: " To date can not be empty",
        }));
      }
    }
  };

  const submitFunc = async (api) => {
    let customers = ConvertArrayToString(customerSelectData);
    let engagementTypes = ConvertArrayToString(engagementTypeSelectedData);
    let obj = {
      Customer: customers,
      EngagementType: engagementTypes,
      FromDate:
        fromDate === null
          ? null
          : moment(fromDate).format(moment.HTML5_FMT.DATE),
      ToDate:
        toDate === null ? null : moment(fromDate).format(moment.HTML5_FMT.DATE),
      sortColumn,
      sortOrder: sortDirection,
      searchText,
      pageSize,
      start,
      count,
    };

    if (api === "submit") {
      const check = Validation();
      if (check) {
        await GetGridData(obj);
      }
    }

    if (api === "reset") {
    }
  };

  const ConvertArrayToString = (arr) => {
    let s = [];
    arr.map((i) => s.push(i.id));
    return s.join(",");
  };

  const ExportToExcel = () => {
    let customers = ConvertArrayToString(customerSelectData);
    let engagementTypes = ConvertArrayToString(engagementTypeSelectedData);
    let obj = {
      Customer: customers,
      EngagementType: engagementTypes,
      FromDate:
        fromDate === null
          ? null
          : moment(fromDate).format(moment.HTML5_FMT.DATE),
      ToDate:
        toDate === null ? null : moment(fromDate).format(moment.HTML5_FMT.DATE),
      sortColumn,
      sortOrder: sortDirection,
      searchText,
      pageSize: count,
      start,
      count,
    };

    console.log(obj);

    axios
      .request({
        responseType: "blob",
        method: "POST",

        //data: Response,
        url: ExportToExcelMilestoneReport,
        //data:JSON,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
        },
        data: obj,
      })
      .then((response) => {
        fileDownload(response.data, "MilestoneReport.xlsx");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const objects = {
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

  const gridColumns = [
    {
      name: "engagement",
      label: "Engagement",
      options: {},
    },
    {
      name: "engagementType",
      label: "Engagement Type",
      options: {},
    },

    {
      name: "mileStone",
      label: "MileStone",
      options: {},
    },

    {
      name: "poValue",
      label: "PO Value",
      options: {},
    },

    {
      name: "plannedDate",
      label: "Planned Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value == null) {
            return <p></p>;
          } else {
            return <p>{moment(value).format(moment.HTML5_FMT.DATE)}</p>;
          }
        },
      },
    },
    {
      name: "revisedDate",
      label: "Actual Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value == null) {
            return <p></p>;
          } else {
            return <p>{moment(value).format(moment.HTML5_FMT.DATE)}</p>;
          }
        },
      },
    },
    {
      name: "invoicedDate",
      label: "Invoice Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value == null) {
            return <p></p>;
          } else {
            return <p>{moment(value).format(moment.HTML5_FMT.DATE)}</p>;
          }
        },
      },
    },
  ];

  const Validation = () => {
    let objError = {};

    if (fromDate == undefined || fromDate == null) {
      objError["fromDate_isEmpty"] = "From date can not be empty";
    }

    if (toDate == undefined || toDate == null) {
      objError["toDate_isEmpty"] = "Valid Till date can not be empty";
    }

    setFormErrors(objError);
    const isEmpty = Object.keys(objError).length === 0;

    return isEmpty;
  };

  return (
    <>
      <Heading title={"Milestone Report"} />

      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Select Customer</label>
                <SelectForm
                  options={customerOptions}
                  placeholder="Select"
                  value={customerSelectData}
                  onChange={(event) => SelectOnChange(event, "customer")}
                  isMulti={true}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Select Engagement Type</label>
                <SelectForm
                  options={engagementTypeOptions}
                  placeholder="Select"
                  value={engagementTypeSelectedData}
                  onChange={(event) => SelectOnChange(event, "engagementType")}
                  isMulti={true}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 align-self-start">
              <div className="form-group">
                <label className="d-block">From Date</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From date"
                    value={fromDate}
                    onChange={(e) => SelectOnChange(e, "fromDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <p style={{ color: "red" }}>{formErrors["fromDate_isEmpty"]}</p>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 align-self-start">
              <div className="form-group">
                <label className="d-block">To Date</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To date"
                    value={toDate}
                    onChange={(e) => SelectOnChange(e, "toDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <p style={{ color: "red" }}>{formErrors["toDate_isEmpty"]}</p>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 align-self-center">
              <div
                style={{ marginTop: "20px" }}
                className="d-flex justify-content-end gap-2"
              >
                <Tooltip title="Export to excel">
                  <button
                    onClick={() => ExportToExcel()}
                    className="btn btn-secondary mr-2"
                  >
                    <i className="fa-solid fa-file-arrow-down"></i>
                  </button>
                </Tooltip>
                <button
                  onClick={() => submitFunc("reset")}
                  className="btn btn-reset ml-1"
                  // disabled={state !== null ? true : false}
                >
                  Reset
                </button>
                <button
                  style={{ background: "#96c61c" }}
                  onClick={() => submitFunc("submit")}
                  className="btn btn-save ml-1"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <DynamicGrid options={objects} data={gridData} columns={gridColumns} />
    </>
  );
};

export default MilestoneReport;
