import { Tooltip } from "@mui/material";
import axios from "axios";
import fileDownload from "js-file-download";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enagagementTypeOptions } from "../../../Common/CommonJson";
import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import Heading from "../../../Components/Heading/Heading";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  EngagementExportToExcel,
  getEngagementMasterGridData,
} from "../../../Helpers/API/APIEndPoints";

const EngagementMaster = () => {
  let navigate = useNavigate();
  const [engagementMasterData, setEngagementMasterData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);

  const getEngagementMasterData = async () => {
    let requestParams = {
      start: start,
      pageSize: pageSize,
      sortColumn: sortColumn,
      sortDirection: sortDirection,
      searchText: searchText,
    };
    const { data } = await APICall(
      getEngagementMasterGridData,
      "POST",
      requestParams
    );
    setEngagementMasterData(data.engagementMasterData);
    setCount(data.count);
  };

  useEffect(() => {
    getEngagementMasterData();
  }, [start, sortColumn, sortDirection, searchText, count]);

  // createdBy: 17
  // createdDate: "2022-08-12T07:56:12.333"
  // customer: "demo1"
  // customerId: 6
  // engagement: "product ex"
  // engagementType: 2
  // id: 25
  // isActive: true
  // modifiedBy: null
  // modifiedDate: null
  // pageSize: 0
  // povalue: 123
  // searchText: ""
  // sortColumn: ""
  // sortDirection: ""
  // start: 0

  const gridColumns = [
    {
      name: "id",
      label: "Id",
      options: {
        display: false,
      },
    },
    {
      name: "customerId",
      label: "customerId",
      options: {
        display: false,
      },
    },
    {
      name: "engagement",
      label: "Engagement",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "customer",
      label: "Customer",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "engagementType",
      label: "Engagement Type",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta) => {
          if (value) {
            let label = "";
            enagagementTypeOptions.map((ele: any) => {
              if (ele.value === Number(value)) {
                label = ele.label;
              }
            });
            return label;
          }
        },
      },
    },
    {
      name: "povalue",
      label: "PO Value",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "poStatus",
      label: "PO Status",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          if (value === 1) {
            return "Recieved";
          } else if (value === 2) {
            return "Expired";
          } else if (value === 3) {
            return "Pending";
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
                }}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </a>
            </>
          );
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
        url: EngagementExportToExcel,
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
          master: "engagement",
        },
      })
      .then((response) => {
        fileDownload(response.data, "Engagement Report.xlsx");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <>
      <Heading title={"Engagement Master"} />
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
        data={engagementMasterData}
        columns={gridColumns}
      />
    </>
  );
};
export default EngagementMaster;
