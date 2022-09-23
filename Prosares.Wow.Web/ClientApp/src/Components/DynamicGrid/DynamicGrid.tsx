import React from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

declare module "@mui/material/styles" {
  interface Components {
    [key: string]: any;
  }
}

const DynamicGrid = (props: any, ...rest: any) => {
  const muiCache = createCache({
    key: "mui",
    prepend: true,
  });

  //   const getMuiTheme = () =>
  //     createTheme({
  //       components: {
  //         MUIDataTableHeadCell: {
  //           styleOverrides: {
  //             root: {
  //               fontSize: 14,
  //               fontWeight: "bold",
  //             },
  //             data: {
  //               fontSize: 14,
  //               fontWeight: "bold",
  //             },
  //           },
  //         },
  //         MUIDataTableBodyCell: {
  //           styleOverrides: {
  //             root: {
  //               fontSize: 14,
  //             },
  //           },
  //         },
  //         MuiTablePagination: {
  //           styleOverrides: {
  //             displayedRows: {
  //               display: "none",
  //             },
  //             actions: {
  //               display: "none",
  //             },
  //           },
  //         },
  //       },
  //     });

  //   const getMuiTheme = () =>
  //     createTheme({
  //       components: {
  //         MUIDataTableBodyCell: {
  //           styleOverrides: {
  //             root: {
  //               backgroundColor: "#FF0000",
  //             },
  //           },
  //         },
  //       },
  //     });

  const getMuiTheme = () =>
    createTheme({
      components: {
        overrides: {
          MuiTab: {
            sortActive: {
              color: "white",
            },
          },
          MuiTableSortLabel: {
            iconDirectionAsc: {
              color: "white !important",
            },
            iconDirectionDesc: {
              color: "white !important",
            },
          },
          MUIDataTable: {
            paper: {
              boxShadow: "none",
            },
          },
          MUIDataTableBodyCell: {
            root: {
              backgroundColor: "#FFF",
              overflow: "hidden",
              whiteSpace: "nowrap",
              padding: "5px 10px",
              textAlign: "start",
            },
          },
          MUIDataTableToolbar: {
            root: {
              display: "none",
            },
          },
          MuiTableCell: {
            head: {
              textAlign: "center",
              backgroundColor: "var(--secondaryColor) !important",
              padding: "2px 1.3%",
            },
          },
          MuiButton: {
            root: {
              color: "white",
            },
          },
          MuiTableHead: {
            root: {
              backgroundColor: "#c1e1ec",
              whiteSpace: "nowrap",
            },
          },
          MuiTableFooter: {
            root: {
              "& .MuiToolbar-root": {
                backgroundColor: "white",
                marginBottom: "1rem",
              },
            },
          },
        },
      },
    });

  // THIS IS WORKING

  // const getMuiTheme = () =>
  //   createTheme({
  //     components: {
  //       MUIDataTableToolbar: {
  //         styleOverrides: {
  //           root: {
  //             backgroundColor: "#3c3c3c",
  //             color: "white",
  //           },
  //           icon: {
  //             color: "white",
  //             "&:hover": {
  //               color: "white",
  //             },
  //           },
  //           iconActive: {
  //             color: "white",
  //           },
  //         },
  //       },
  //       MUIDataTableSearch: {
  //         styleOverrides: {
  //           searchIcon: {
  //             color: "white",
  //           },
  //           searchText: {
  //             "& input": {
  //               color: "white",
  //             },
  //           },
  //           clearIcon: {
  //             color: "white",
  //           },
  //         },
  //       },
  //       MUIDataTableHeadCell: {
  //         styleOverrides: {
  //           root: {
  //             backgroundColor: "#3c3c3c",
  //             color: "white",
  //           },
  //           sortActive: {
  //             color: "white",
  //           },
  //         },
  //       },
  //       MuiButtonBase: {
  //         styleOverrides: {
  //           root: {
  //             "& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon": {
  //               color: "white",
  //             },
  //           },
  //         },
  //       },
  //       MUIDataTableBodyRow: {
  //         styleOverrides: {
  //           root: {
  //             ":nth-child(odd)": {
  //               backgroundColor: "#ececec",
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const columns = ["Name", "Company", "City", "State"];

  const data = [
    { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
    { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
    { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
    {
      name: "James Houston",
      company: "est Corp",
      city: "Dallas",
      state: "TX",
    },
  ];

  const columns = [
    {
      name: "Id",
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
      name: "company",
      label: "ABR",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          let EncryptedParam =
            tableMeta.tableData[tableMeta.rowIndex].EncryptedParam;
          let SPHostUrl =
            "https://prosaressolutions.sharepoint.com/sites/LegaDoxV2/";
          let actionUrl = `/Organization/Edit?PSId=${EncryptedParam}&SPHostUrl=${SPHostUrl}`;

          return (
            <>
              <a href={actionUrl}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </a>
            </>
          );
        },
      },
    },
  ];

  return (
    <div className="p-3">
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={props.title}
            data={props.data}
            columns={props.columns}
            options={props.options}
          />
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
};

export default DynamicGrid;
