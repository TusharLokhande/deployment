import React, { useEffect, useState } from "react";
import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import "./CustomerMaster.css";
import { Link, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  CustomerExportToExcel,
  getCustomerDataUrl,
} from "../../../Helpers/API/APIEndPoints";
import Heading from "../../../Components/Heading/Heading";
import { Tooltip } from "@mui/material";
import fileDownload from "js-file-download";
import axios from "axios";

const CustomerMaster = () => {
  let navigate = useNavigate();

  const [customerData, setCustomerData] = useState([]);
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
      name: "abbreviation",
      label: "Abbreviaton",
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

          // let EncryptedParam =
          //   tableMeta.tableData[tableMeta.rowIndex].EncryptedParam;
          // let SPHostUrl =
          //   "https://prosaressolutions.sharepoint.com/sites/LegaDoxV2/";

          // let actionUrl = `/Organization/Edit?PSId=${EncryptedParam}&SPHostUrl=${SPHostUrl}`;

          return (
            <>
              <Link to={"edit"} state={id}>
                <i
                  className="fa fa-pencil text-secondary"
                  aria-hidden="true"></i>
              </Link>
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

      const { data } = await APICall(getCustomerDataUrl, "POST", requestParams);
      setCustomerData(data.customerData);
      setCount(data.count);
    })();
  }, [start, sortColumn, sortDirection, searchText]);

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
        url: CustomerExportToExcel,
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
          master: "customer",
        },
      })
      .then((response) => {
        fileDownload(response.data, "Customer Report.xlsx");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  return (
    <>
      <Heading title={"Customer Master"} />
      <div className="px-3 pt-3 d-flex justify-content-end">
        <Tooltip title="Export to excel">
          <button
            onClick={() => ExportToExcel()}
            className="btn btn-secondary mr-2">
            <i className="fa-solid fa-file-arrow-down"></i>
          </button>
        </Tooltip>
        <Link to={"edit"} className="btn btn-primary">
          + Create
        </Link>
      </div>
      <DynamicGrid
        options={options}
        data={customerData}
        columns={gridColumns}
      />
    </>
  );
};

export default CustomerMaster;
