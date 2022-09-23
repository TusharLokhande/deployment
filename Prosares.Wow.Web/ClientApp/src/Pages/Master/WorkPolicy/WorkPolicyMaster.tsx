import React, { useEffect, useState } from "react";
import DynamicGrid from "../../../Components/DynamicGrid/DynamicGrid";
import "./WorkPolicyMaster.css";
import { Link, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  getWorkPolicyDataUrl,
  WorkPolicyExportToExcel,
} from "../../../Helpers/API/APIEndPoints";
import moment from "moment";
import Heading from "../../../Components/Heading/Heading";
import { Tooltip } from "@mui/material";
import fileDownload from "js-file-download";
import axios from "axios";

const WorkPolicyMaster = () => {
  let navigate = useNavigate();

  const [workPolicyData, setWorkPolicyData] = useState([]);
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
      name: "policyName",
      label: "Policy Name",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "validFrom",
      label: "Valid From",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "validTill",
      label: "Valid Till",
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
    // {
    //   name: "holiday1",
    //   label: "Holiday 1",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday2",
    //   label: "Holiday 2",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday3",
    //   label: "Holiday 3",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday4",
    //   label: "Holiday 4",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday5",
    //   label: "Holiday 5",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday6",
    //   label: "Holiday 6",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday7",
    //   label: "Holiday 7",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday8",
    //   label: "Holiday 8",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday9",
    //   label: "Holiday 9",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday10",
    //   label: "Holiday 10",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
    // {
    //   name: "holiday11",
    //   label: "Holiday 11",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     sortDescFirst: true,
    //   },
    // },
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
        getWorkPolicyDataUrl,
        "POST",
        requestParams
      );
      // this is to change the formate of the date in frontend using the react
      data.workPoliciesMasterData.map((ele) => {
        ele.validFrom = moment(ele.validFrom).format(moment.HTML5_FMT.DATE);
        ele.validTill = moment(ele.validTill).format(moment.HTML5_FMT.DATE);
        // ele.holiday1 =
        //   ele.holiday1 == null
        //     ? ""
        //     : moment(ele.holiday1).format(moment.HTML5_FMT.DATE);

        // ele.holiday2 =
        //   ele.holiday2 == null
        //     ? ""
        //     : moment(ele.holiday2).format(moment.HTML5_FMT.DATE);

        // ele.holiday3 =
        //   ele.holiday3 == null
        //     ? ""
        //     : moment(ele.holiday3).format(moment.HTML5_FMT.DATE);

        // ele.holiday4 =
        //   ele.holiday4 == null
        //     ? ""
        //     : moment(ele.holiday4).format(moment.HTML5_FMT.DATE);

        // ele.holiday5 =
        //   ele.holiday5 == null
        //     ? ""
        //     : moment(ele.holiday5).format(moment.HTML5_FMT.DATE);

        // ele.holiday6 =
        //   ele.holiday6 == null
        //     ? ""
        //     : moment(ele.holiday6).format(moment.HTML5_FMT.DATE);

        // ele.holiday7 =
        //   ele.holiday7 == null
        //     ? ""
        //     : moment(ele.holiday7).format(moment.HTML5_FMT.DATE);

        // ele.holiday8 =
        //   ele.holiday8 == null
        //     ? ""
        //     : moment(ele.holiday8).format(moment.HTML5_FMT.DATE);

        // ele.holiday9 =
        //   ele.holiday9 == null
        //     ? ""
        //     : moment(ele.holiday9).format(moment.HTML5_FMT.DATE);

        // ele.holiday10 =
        //   ele.holiday10 == null
        //     ? ""
        //     : moment(ele.holiday10).format(moment.HTML5_FMT.DATE);

        // ele.holiday11 =
        //   ele.holiday11 == null
        //     ? ""
        //     : moment(ele.holiday10).format(moment.HTML5_FMT.DATE);
      });
      setWorkPolicyData(data.workPoliciesMasterData);
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
        url: WorkPolicyExportToExcel,
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
          master: "workpolicy",
        },
      })
      .then((response) => {
        fileDownload(response.data, "WorkPolicy Report.xlsx");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <>
      <Heading title={"Work Policy Master"} />
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
        data={workPolicyData}
        columns={gridColumns}
      />
    </>
  );
};

export default WorkPolicyMaster;
