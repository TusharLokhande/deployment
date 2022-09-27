import { TextField, Tooltip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import fileDownload from "js-file-download";

import moment from "moment";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  getCapacityUtilizationCustomerData,
  getCapacityUtilizationEngagement,
  getCapacityUtilizationEngagementTypeOption,
  getCapacityAllocation,
  CapacityUtilizationReportExportToExcel,
} from "../../../Helpers/API/APIEndPoints";
import { LoaderContext } from "../../../Helpers/Context/Context";
import "./CapacityUtilizationReport.css";

const CapacityUtilizationReport = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customerSelectData, setCustomerSelectData] = useState([]);
  const [engagementOptions, setEngagementOptions] = useState([]);
  const [engagementSelectedData, setEngagementSelectedData] = useState([]);
  const [engagementTypeOptions, setEngagementTypeOptions] = useState([]);
  const [engagementTypeSelectedData, setEngagementTypeSelectedData] = useState(
    []
  );
  const [masterType, setMasterType] = useState({
    value: "",
    label: "Select Report Type",
    id: 0,
  });
  const [requestObject, setRequestObject] = useState([{ count: 0 }]);
  const [gridType, setGridType] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const { showLoader, hideLoader } = useContext(LoaderContext);

  let navigate = useNavigate();
  let formErrorObj = {};

  useEffect(() => {
    GetCustomerData();
    GetEngagementData();
    GetEngagementTypeData();
  }, []);

  useEffect(() => {
    let customers = ConvertArrayToString(customerSelectData);
    let engagements = ConvertArrayToString(engagementSelectedData);
    let engagementTypes = ConvertArrayToString(engagementTypeSelectedData);

    let requestData = {
      MasterType: masterType.value,
      Customers: customers,
      Engagements: engagements,
      EngagementTypes: engagementTypes,
      FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
      ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
      sortColumn,
      sortDirection,
      searchText,
      pageSize,
      start,
      count,
    };
    let s = Response(requestData, masterType);
  }, [sortDirection, sortColumn, searchText, start, pageSize]);

  const masterTypeOptions = [
    { value: "Engagement", label: "Engagement", id: 1 },
    { value: "Resource", label: "Resource", id: 2 },
    { value: "Engagement Resource", label: "Engagement-Resource", id: 3 },
    { value: "Engagement Type", label: "Engagement-Type", id: 4 },
  ];

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

  const GetEngagementData = async () => {
    let { data } = await APICall(getCapacityUtilizationEngagement, "POST", {});

    let options = [];
    data.map((item, index) => {
      options.push({ value: item.name, label: item.name, id: item.id });
    });
    options.sort((a, b) => a.value.localeCompare(b.value));
    setEngagementOptions(options);
  };

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

  let s = "";
  const SelectOnChange = (event, apiField) => {
    if (apiField === "customer") {
      setCustomerSelectData(event);
    }

    if (apiField === "engagement") {
      setEngagementSelectedData(event);
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

    if (apiField === "masterType") {
      setMasterType(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["master_Empty"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["master_Empty"]: "Please select master type.",
        }));
      }
      // let customers = ConvertArrayToString(customerSelectData);
      // let engagements = ConvertArrayToString(engagementSelectedData);
      // let engagementTypes = ConvertArrayToString(engagementTypeSelectedData);

      // let requestData = {
      //   MasterType: "",
      //   Customers: customers,
      //   Engagements: engagements,
      //   EngagementTypes: engagementTypes,
      //   FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
      //   ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
      //   pageSize,
      //   start,
      // };

      // if (event.value === "Resource") {
      //   setGridType(gridColumns_Resource);
      // }

      // if (event.value === "Engagement") {
      //   setGridType(gridColumns_Engagement);
      // }

      // if (event.value === "Engagement Resource") {
      //   setGridType(gridColumns_EngagementResource);
      // }

      // if (event.value === "Engagement Type") {
      //   setGridType(gridColumns_EngagementType);
      // }
    }
  };

  const ConvertArrayToString = (arr) => {
    let s = [];
    arr.map((i) => s.push(i.id));
    return s.join(",");
  };

  const Validation = () => {
    let objError = {};

    if (fromDate == undefined || fromDate == null) {
      objError["fromDate_isEmpty"] = "From date can not be empty";
    }

    if (toDate == undefined || toDate == null) {
      objError["toDate_isEmpty"] = "Valid Till date can not be empty";
    }

    if (masterType.id === 0) {
      objError["master_Empty"] = "Please select master type.";
    }
    formErrorObj = objError;
    setFormErrors(objError);
    const isEmpty = Object.keys(objError).length === 0;

    return isEmpty;
  };

  const Response = async (obj, api) => {
    showLoader();
    if (masterType.value === "Resource") {
      setGridType(gridColumns_Resource);
    }

    if (masterType.value === "Engagement") {
      setGridType(gridColumns_Engagement);
    }

    if (masterType.value === "Engagement Resource") {
      setGridType(gridColumns_EngagementResource);
    }

    if (masterType.value === "Engagement Type") {
      setGridType(gridColumns_EngagementType);
    }

    let x = { count: 0, data: [] };
    const { data } = await APICall(getCapacityAllocation, "POST", obj);
    x = { ...data };
    setRequestObject(x.data);
    setCount(x.count);
    hideLoader();
    return;
  };

  const submitFunc = async (field) => {
    if (field === "submit") {
      let customers = ConvertArrayToString(customerSelectData);
      let engagements = ConvertArrayToString(engagementSelectedData);
      let engagementTypes = ConvertArrayToString(engagementTypeSelectedData);

      let requestData = {
        MasterType: masterType.value,
        Customers: customers,
        Engagements: engagements,
        EngagementTypes: engagementTypes,
        FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
        ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
        sortColumn,
        sortDirection,
        searchText,
        pageSize,
        start,
        count,
      };
      const check = Validation();

      if (check) {
        Response(requestData, "");
      }

      return;
    }

    if (field === "reset") {
      setFromDate(null);
      setToDate(null);
      setFormErrors({});
      setCustomerSelectData([]);
      setEngagementSelectedData([]);
      setEngagementTypeSelectedData([]);
      setMasterType({
        value: "",
        label: "Select Master Type",
        id: 0,
      });
    }
  };

  const ExportToExcel = () => {
    let customers = ConvertArrayToString(customerSelectData);
    let engagements = ConvertArrayToString(engagementSelectedData);
    let engagementTypes = ConvertArrayToString(engagementTypeSelectedData);
    const obj = {
      MasterType: masterType.value,
      Customers: customers,
      Engagements: engagements,
      EngagementTypes: engagementTypes,
      FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
      ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
      sortColumn,
      sortDirection,
      searchText,
      pageSize,
      start: 0,
      count,
    };

    const check = Validation();

    if (check) {
      axios
        .request({
          responseType: "blob",
          method: "POST",

          //data: Response,
          url: CapacityUtilizationReportExportToExcel,
          //data:JSON,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
          },
          data: obj,
        })
        .then((response) => {
          fileDownload(response.data, "CapacityUtilizationReport.xlsx");
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };

  const gridColumns_Resource = [
    {
      name: "resource",
      label: "Resource",
      options: {},
    },
    {
      name: "engagementType",
      label: "Engagement Type",
      options: {},
    },
    {
      name: "mandaysPlanned",
      label: "Mandays Planned",
      options: {},
    },
    {
      name: "mandaysActual",
      label: "Mandays Actual",
      options: {},
    },
    {
      name: "nonCharged",
      label: "Mandays Non-Charged Actual",
      options: {},
    },
    {
      name: "mandaysLeaves",
      label: "Mandays Leaves",
      options: {},
    },
    {
      name: "variance",
      label: "Variance",
      options: {},
    },
  ];

  const gridColumns_Engagement = [
    {
      name: "customer",
      label: "Customer",
    },
    {
      name: "engagement",
      label: "Engagement",
    },
    {
      name: "engagementType",
      label: "Engagement Type",
    },
    {
      name: "mandaysPlanned",
      label: "Mandays Planned",
    },
    {
      name: "mandaysActual",
      label: "Mandays Actual",
    },
    {
      name: "variance",
      label: "Variance",
    },
    {
      name: "nonCharged",
      label: "Non Charged",
    },
    {
      name: "poManDays",
      label: "PO Mandays",
    },
    {
      name: "budgetMandays",
      label: "Budget Mandays",
    },
    {
      name: "totalspendMandays",
      label: "Total Spend Mandays",
    },
    {
      name: "balanceMandays",
      label: "Balanced Mandays",
    },
    {
      name: "poValue",
      label: "PO Value",
    },
    {
      name: "poStatus",
      label: "Po Status",
    },
  ];

  const gridColumns_EngagementType = [
    {
      name: "engagementType",
      label: "Engagement Type",
    },
    {
      name: "mandaysPlanned",
      label: "Mandays Planned",
    },
    {
      name: "mandaysActual",
      label: "Mandays Actual",
    },
    {
      name: "variance",
      label: "Variance",
    },
    {
      name: "nonCharged",
      label: "Non Charged",
    },
  ];

  const gridColumns_EngagementResource = [
    {
      name: "customer",
      label: "Customer",
    },
    {
      name: "engagement",
      label: "Engagement",
    },
    {
      name: "engagementType",
      label: "Engagement Type",
    },
    {
      name: "resource",
      label: "Resource",
      options: {},
    },
    {
      name: "mandaysPlanned",
      label: "Mandays Planned",
    },
    {
      name: "mandaysActual",
      label: "Mandays Actual",
      options: {},
    },
    {
      name: "nonCharged",
      label: "Non Charged",
    },
    {
      name: "variance",
      label: "Variance",
    },
  ];

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

  return (
    <>
      <div className="main">
        <section className="bg_breadcrumb">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <h4>Capacity Utizaltion Report</h4>
              </div>
            </div>
          </div>
        </section>

        <section className="main_content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>Select Customer</label>
                  <SelectForm
                    value={customerSelectData}
                    onChange={(e) => SelectOnChange(e, "customer")}
                    options={customerOptions}
                    isMulti
                    isSearchable={false}
                    isClearable={true}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    placeholder="Select Customer"
                  />
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>Select EngagementType</label>
                  <SelectForm
                    value={engagementTypeSelectedData}
                    onChange={(e) => SelectOnChange(e, "engagementType")}
                    options={engagementTypeOptions}
                    isMulti
                    isSearchable={false}
                    isClearable={true}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    placeholder="Select Engagement"
                  />
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>Select Engagement</label>
                  <SelectForm
                    value={engagementSelectedData}
                    onChange={(e) => SelectOnChange(e, "engagement")}
                    options={engagementOptions}
                    isMulti
                    isSearchable={false}
                    isClearable={true}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    placeholder="Select Engagement"
                  />
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label className="d-block">
                    From Date <sup>*</sup>
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="From Date"
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

              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label className="d-block">
                    To Date <sup>*</sup>
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="To Date"
                      value={toDate}
                      onChange={(e) => SelectOnChange(e, "toDate")}
                      inputFormat="dd/MM/yyyy"
                      minDate={fromDate}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </LocalizationProvider>
                  <p style={{ color: "red" }}>{formErrors["toDate_isEmpty"]}</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-6">
                <label>
                  Select Report Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <SelectForm
                  key={1}
                  options={masterTypeOptions}
                  placeholder="Select Report"
                  isDisabled={false}
                  value={masterType}
                  onChange={(e) => SelectOnChange(e, "masterType")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
                <p style={{ color: "red" }}>{formErrors["master_Empty"]}</p>
              </div>

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
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="main_content">
          <DynamicGrid
            options={objects}
            data={requestObject}
            columns={gridType}
          />
        </section>
      </div>
    </>
  );
};

export default CapacityUtilizationReport;
