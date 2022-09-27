import { TextField, Tooltip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import fileDownload from "js-file-download";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import Heading from "../../../Components/Heading/Heading";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  getMilestoneDataUrl,
  MilestoneExportToExcel,
} from "../../../Helpers/API/APIEndPoints";
import { LoaderContext } from "../../../Helpers/Context/Context";
import notify from "../../../Helpers/ToastNotification";
import "./MilestoneMaster.css";

const MilestoneMaster = () => {
  let navigate = useNavigate();

  const [milestoneData, setMilestoneData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);
  const [fromDate, setFromDate] = React.useState<Date | null>(
    moment()
      .startOf("month")
      .toDate()
  );
  const [toDate, setToDate] = React.useState<Date | null>(
    moment()
      .endOf("month")
      .toDate()
  );
  const [filterData, setFilterData] = useState(false);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const gridColumns = [
    {
      name: "id",
      label: "Id",
      options: {
        display: false,
      },
    },
    {
      name: "mileStones",
      label: "Milestone",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },

    {
      name: "amount",
      label: "Amount",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },

    {
      name: "plannedDate",
      label: "Planned Date",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },

    {
      name: "revisedDate",
      label: "Revised Date",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },

    {
      name: "completedDate",
      label: "Completed Date",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },

    {
      name: "invoicedDate",
      label: "Invoiced Date",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta) => {
          if (value === null || value === "Invalid date") {
            return <p></p>;
          } else {
            return <p>{value}</p>;
          }
        },
      },
    },

    {
      name: "isActive",
      label: "Active",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          if (value) {
            return <i className="fas fa-check"></i>;
          } else {
            return <i className="fas fa-times"></i>;
          }
        },
      },
    },
    {
      name: "",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          let id = tableMeta.tableData[tableMeta.rowIndex].id;

          return (
            <>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("edit", { state: id });
                }}
              >
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </a>
            </>
          );
        },
      },
    },
  ];
  useEffect(() => {
    (async () => {
      showLoader();
      let requestParams = {
        start: start,
        pageSize: pageSize,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
        searchText: searchText,
        fromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
        toDate: moment(toDate).format(moment.HTML5_FMT.DATE),
      };

      const { data } = await APICall(
        getMilestoneDataUrl,
        "POST",
        requestParams
      );
      setMilestoneData(data.milestoneData);

      if (data.milestoneData != null || data.milestoneData != undefined) {
        await data.milestoneData.map(async (mileStone) => {
          mileStone.plannedDate = await moment(mileStone.plannedDate).format(
            "DD/MM/YYYY"
          );
          mileStone.revisedDate = await moment(mileStone.revisedDate).format(
            "DD/MM/YYYY"
          );
          mileStone.completedDate = await moment(
            mileStone.completedDate
          ).format("DD/MM/YYYY");
          mileStone.invoicedDate = await moment(mileStone.invoicedDate).format(
            "DD/MM/YYYY"
          );
        });
      }
      setCount(data.count);
      hideLoader();
    })();
  }, [start, sortColumn, sortDirection, searchText, filterData]);

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
  const ExportToExcel = async () => {
    axios
      .request({
        responseType: "blob",
        method: "POST",

        //data: Response,
        url: MilestoneExportToExcel,
        //data:JSON,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
        },
        data: {
          searchText: searchText,
          sortColumn: sortColumn,
          sortDirection: sortDirection,
          fromDate,
          toDate,
        },
      })
      .then((response) => {
        fileDownload(response.data, "Milestone.xlsx");
      })
      .catch((error) => {
        notify(1, "Something went wrong!");
      });
  };
  const handleFilterChange = async (event, name) => {
    if (name === "fromDate") {
      setFromDate(event);
    } else {
      setToDate(event);
    }
  };

  const onClickFunction = async (action) => {
    if (action === "reset") {
      setFromDate(
        moment()
          .startOf("month")
          .toDate()
      );
      setToDate(
        moment()
          .endOf("month")
          .toDate()
      );
    }
    setFilterData(!filterData);
  };

  return (
    <>
      <Heading title={"Milestone"} />
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
            <div className="col-lg-2 col-md-4 col-sm-6 align-self-center">
              <div className="form-group">
                <label className="d-block">From Date</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From date"
                    value={fromDate}
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
                    value={toDate}
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
        data={milestoneData}
        columns={gridColumns}
      />
    </>
  );
};

export default MilestoneMaster;
