import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import { APICall } from "../../../Helpers/API/APICalls";
import "./EmployeeMaster.css";
import {
  EmployeeExportToExcel,
  getEmployeeMasterGridData,
} from "../../../Helpers/API/APIEndPoints";
import Heading from "../../../Components/Heading/Heading";
import { Tooltip } from "@mui/material";
import fileDownload from "js-file-download";
import axios from "axios";

const EmployeeMaster = () => {
  let navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);

  const gridColumns = [
    {
      name: "id",
      label: "Id",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "shortName",
      label: "Short Name",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
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
                }}>
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
      let requestParams = {
        start: start,
        pageSize: pageSize,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
        searchText: searchText,
      };

      const { data } = await APICall(
        getEmployeeMasterGridData,
        "POST",
        requestParams
      );
      setEmployeeData(data.employeeData);
      setCount(data.count);
    })();
  }, [start, sortColumn, sortDirection, searchText, count]);

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
        url: EmployeeExportToExcel,
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
          master: "employee",
        },
      })
      .then((response) => {
        fileDownload(response.data, "Employee Report.xlsx");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  return (
    <>
      <Heading title={"Employee Master"} />
      <div className="px-3 pt-3 d-flex justify-content-end">
        <Tooltip title="Export to excel">
          <button
            onClick={() => ExportToExcel()}
            className="btn btn-secondary mr-2">
            <i className="fa-solid fa-file-arrow-down"></i>
          </button>
        </Tooltip>
        <button onClick={() => navigate("edit")} className="btn btn-primary">
          + Create
        </button>
      </div>
      <DynamicGrid
        options={options}
        data={employeeData}
        columns={gridColumns}
      />
    </>
  );
};

export default EmployeeMaster;
