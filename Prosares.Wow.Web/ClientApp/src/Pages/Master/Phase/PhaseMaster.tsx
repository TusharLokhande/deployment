import React, { useEffect, useState } from "react";
import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import "./PhaseMaster.css";
import { Link, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  getPhaseDataUrl,
  PhaseExportToExcel,
} from "../../../Helpers/API/APIEndPoints";
import Heading from "../../../Components/Heading/Heading";
import { Tooltip } from "@mui/material";
import fileDownload from "js-file-download";
import axios from "axios";

const PhaseMaster = () => {
  let navigate = useNavigate();

  const [phaseData, setPhaseData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [count, setCount] = useState(0);
  //   {
  //     "phase": "Phase1",
  //     "description": "This is test phase 1",
  //     "engagementId": 1,
  //     "plannedDate": "2022-06-15T00:00:00",
  //     "actualDate": "2022-06-15T00:00:00",
  //     "sortColumn": null,
  //     "sortDirection": null,
  //     "pageSize": 0,
  //     "start": 0,
  //     "searchText": null,
  //     "engagement": null,
  //     "taskMasters": [],
  //     "ticketsMasters": [],
  //     "id": 1,
  //     "isActive": true,
  //     "createdDate": "2022-06-15T16:40:17.707",
  //     "createdBy": 1,
  //     "modifiedDate": "2022-06-15T16:40:17.707",
  //     "modifiedBy": 1
  // },

  const gridColumns = [
    {
      name: "id",
      label: "Id",
      options: {
        display: false,
      },
    },
    {
      name: "phase",
      label: "Name",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "description",
      label: "Description",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "engagementName",
      label: "Engagement",
      options: {
        filter: false,
        sort: false,
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

      const { data } = await APICall(getPhaseDataUrl, "POST", requestParams);
      setPhaseData(data.phaseMasterData);
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
    onChangeRowsPerPage: (num) => {},
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
        url: PhaseExportToExcel,
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
          master: "phase",
        },
      })
      .then((response) => {
        fileDownload(response.data, "Phase Report.xlsx");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  return (
    <>
      <Heading title={"Phase Master"} />
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
      <DynamicGrid options={options} data={phaseData} columns={gridColumns} />
    </>
  );
};

export default PhaseMaster;
