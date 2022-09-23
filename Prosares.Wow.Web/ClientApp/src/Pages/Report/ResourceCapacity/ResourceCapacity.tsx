import { TextField, Tooltip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useContext, useEffect, useState } from "react";
import Heading from "../../../Components/Heading/Heading";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import "./ResourceCapacity.css";
import moment from "moment";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  ExportToExcelResourceCapacity,
  GetResourceCapacityData,
} from "../../../Helpers/API/APIEndPoints";
import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import { LoaderContext } from "../../../Helpers/Context/Context";
import axios from "axios";
import fileDownload from "js-file-download";
import notify from "../../../Helpers/ToastNotification";

const ResourceCapacity = () => {
  const [date, setDate] = useState<Date | null>(
    moment()
      .startOf("month")
      .toDate()
  );
  const [month, setMonth] = useState(
    moment()
      .startOf("month")
      .toDate()
      .getMonth()
  );
  const [year, setYear] = useState<any>(
    moment()
      .startOf("month")
      .toDate()
      .getFullYear()
  );

  const [gridData, setGridData] = useState([]);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [reset, setReset] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    GetGridData();
  }, []);

  useEffect(() => {
    GetGridData();
  }, [reset]);

  useEffect(() => {
    GetGridData();
  }, [sortDirection, sortColumn, searchText, start, pageSize]);

  const GetGridData = async () => {
    showLoader();
    let requestObj = {
      Month: months[month],
      Year: year,
      sortColumn,
      sortDirection,
      searchText,
      pageSize,
      start,
    };
    const { data } = await APICall(GetResourceCapacityData, "POST", requestObj);
    setGridData(data.data);
    setCount(data.count);
    hideLoader();
  };

  const SelectOnChange = (e, apiField) => {
    if (apiField === "Year&Month") {
      setDate(e);
      const mm = moment(e)
        .toDate()
        .getMonth();

      const yyyy = moment(e)
        .toDate()
        .getFullYear();

      setMonth(mm);
      setYear(yyyy);
    }
  };

  const submitFunc = async (apiField) => {
    if (apiField === "submit") {
      await GetGridData();
      return;
    }

    if (apiField === "reset") {
      setMonth(
        moment()
          .startOf("month")
          .toDate()
          .getMonth()
      );
      setYear(
        moment()
          .startOf("month")
          .toDate()
          .getFullYear()
      );

      setDate(
        moment()
          .startOf("month")
          .toDate()
      );
      setReset(!reset);
    }
  };

  const ExportToExcel = () => {
    let obj = {
      Month: months[month],
      Year: year,
      sortColumn,
      sortDirection,
      searchText,
      pageSize: count,
      start: 0,
    };
    axios
      .request({
        responseType: "blob",
        method: "POST",

        //data: Response,
        url: ExportToExcelResourceCapacity,
        //data:JSON,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
        },
        data: obj,
      })
      .then((response) => {
        fileDownload(response.data, "ResourceCapacity.xlsx");
      })
      .catch((error) => {
        notify(1, "Something went wrong");
      });
  };
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
    { name: "name", label: "Resource" },
    { name: "plannedTM", label: "Planned T&M" },
    { name: "plannedAMC", label: "Planned AMC" },
    { name: "plannedProject", label: "Planned Project" },
    { name: "plannedProduct", label: "Planned Product" },
    { name: "plannedInternal", label: "Planned Internal" },
    { name: "leaves", label: "Leaves" },
    { name: "spare", label: "Planned Spare" },
    { name: "plannedTotal", label: "Planned Total" },

    { name: "actualTM", label: "Actual T&M" },
    { name: "actualAMC", label: "Actual AMC" },
    { name: "actualProject", label: "Actual Project" },
    { name: "actualProduct", label: "Actual Product" },
    { name: "actualInternal", label: "Actual Internal" },
    { name: "actualSpare", label: "Actual Spare" },
    { name: "actualTotal", label: "Actual Total" },
  ];

  return (
    <>
      <Heading title={"Resource Capacity"} />
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-md-4 col-sm-6 align-self-center">
              <div className="form-group">
                <label className="d-block">Select Date</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={["year", "month"]}
                    label="Year and Month"
                    value={date}
                    onChange={(e) => {
                      SelectOnChange(e, "Year&Month");
                    }}
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
                  onClick={() => submitFunc("reset")}
                  className="btn btn-reset ml-1"
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

      <DynamicGrid options={options} columns={gridColumns} data={gridData} />
    </>
  );
};

export default ResourceCapacity;
