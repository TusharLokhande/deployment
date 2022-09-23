import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  GetDropDownList,
  getEmployeeAvailableLeaveBalance,
  getEmployeeReportingManager,
  getLeaveRequestDataById,
  getPendingLeavesById,
  getWorkPolicyHolidayList,
  getWorkPolicyWorkdayList,
  InsertUpdateLeaveRequestData,
} from "../../../Helpers/API/APIEndPoints";
import InputForm from "../../../Components/InputForm/InputForm";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import moment from "moment";
import Heading from "../../../Components/Heading/Heading";
import { leaveTypeOptions } from "../../../Common/CommonJson";
import notify from "../../../Helpers/ToastNotification";
import { getContext, LoaderContext } from "../../../Helpers/Context/Context";
import { Form } from "react-bootstrap";

interface LocationState {
  id: number;
  role: string;
}

const LeaveRequestMasterEdit = () => {
  let navigate = useNavigate();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const location = useLocation();
  const state = location.state as LocationState; // Type Casting, then you can get the params passed via router
  const [leaveDays, setLeaveDays] = useState(0);
  const [remark, setRemark] = useState("");
  const [submitId, setSubmitId] = useState(0);
  const [approverOptions, setApproverOptions] = useState<any>([]);
  const [leaveReasonOptions, setLeaveReasonOptions] = useState<any>([]);
  const [approver, setApprover] = useState<any>({});
  const approverId = useRef<any>(0);
  const requestorId = useRef<any>(0);
  const [leaveType, setLeaveType] = useState<any>({});
  const [leaveReason, setLeaveReason] = useState<any>({});
  const [fromDate, setFromDate] = React.useState<Date | null>(new Date());
  const [toDate, setToDate] = React.useState<Date | null>(new Date());
  const [formErrors, setFormErrors] = useState({});
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [fromDateLeaveType, setFromDateLeaveType] = useState<any>(
    leaveTypeOptions[0]
  );
  const [toDateLeaveType, setToDateLeaveType] = useState<any>(
    leaveTypeOptions[0]
  );
  const [holidayList, setHolidayList] = useState([]);
  const [workdayList, setWorkdayList] = useState([]);
  const [leaveTypeOptionsArr, setLeaveTypeOptionsArr] = useState<any>([]);
  const [FYIUsers, setFYIUsers] = useState<any>([]);
  const FYIUsersId = useRef<any>();
  const [leaveStatusOnEdit, setLeaveStatusOnEdit] = useState(false);
  let formErrorObj = {};

  const [env, setEnv] = useState<any>(
    process.env.REACT_APP_PUBLISH_PATH ? process.env.REACT_APP_PUBLISH_PATH : ""
  );

  const { EmployeeId, EmployeeWorkPolicyId, RoleId } = getContext();
  const RoleIdArray = RoleId.split(",");
  const [canChangeRequestor, setCanChangeRequestor] = useState(false);
  const [requestor, setRequestor] = useState<any>({
    value: Number(EmployeeId),
  });

  const [pendingDates, setPendingDates] = useState<any>([]);

  const submitApiCall = async (submitObj: any) => {
    showLoader();
    const { data, status } = await APICall(
      InsertUpdateLeaveRequestData,
      "POST",
      submitObj
    );

    hideLoader();
    // console.log(data, status);

    if (data && data > 0 && status === 0) {
      navigate(`${env}/master/leaveRequest`);
      //change notification as per screen
      if (state !== null && state.role === "self") {
        notify(0, "Leave Cancelled!");
      } else if (
        state !== null &&
        state.role !== "self" &&
        leaveStatusOnEdit === true
      ) {
        notify(0, "Leave Approved!");
      } else if (
        state !== null &&
        state.role !== "self" &&
        leaveStatusOnEdit === false
      ) {
        notify(0, "Leave Rejected!");
      } else {
        notify(0, "Leave Requested successfully");
      }
    } else {
      notify(1, "Leave Request fail");
    }
  };

  const getLeaveReqById = async () => {
    if (state && state.id !== null) {
      let post = {
        id: state.id,
      };
      const { data } = await APICall(getLeaveRequestDataById, "POST", post);
      if (data !== null || typeof data !== "string") {
        // console.log(data);

        setSubmitId(data[0].id);
        // setApprover({ value: data[0].approverId, label: data[0].approver });
        approverId.current = data[0].approverId;
        requestorId.current = data[0].requestorId;
        setLeaveStatusOnEdit(
          data[0].requestStatus === 3
            ? false
            : state.role === "self"
            ? false
            : true
        );
        setFromDate(new Date(data[0].fromDate));
        setToDate(new Date(data[0].toDate));
        // setLeaveDays(data[0].leaveDays.toString());
        setLeaveReason({ value: data[0].resonId, label: data[0].reson });
        setRemark(data[0].remark === null ? "" : data[0].remark);
        // setIsActive(data.isActive);
        leaveTypeOptions.map((option: any) => {
          if (option.value === data[0].fromDateLeaveType) {
            setFromDateLeaveType(option);
          }
        });
        leaveTypeOptions.map((option: any) => {
          if (option.value === data[0].toDateLeaveType) {
            setToDateLeaveType(option);
          }
        });
        FYIUsersId.current =
          data[0].fyiUsers !== null &&
          data[0].fyiUsers.split(`,`).map((x) => parseInt(x, 10));
      }
    }
  };

  const resetFunc = () => {
    // setRequestor({ value: Number(EmployeeId) });
    // setApprover({});
    setFormErrors({});
    setFromDate(null);
    setToDate(null);
    setLeaveDays(0);
    setLeaveReason({});
    setRemark("");
    setFYIUsers([]);
  };

  const approverApiCall = async () => {
    let postObject = {
      searchFor: "employee",
      searchValue: 1,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data != undefined || data != null) {
      let approverArray = [];
      await data.map((approver: any) => {
        let tempObj = {
          eid: approver.eid,
          value: approver.id,
          label: approver.name,
        };
        approverArray.push(tempObj);
      });

      setApproverOptions(approverArray);

      // if (approverId.current !== 0) {
      //   let approver = approverArray.find(
      //     (ele) => ele.value === approverId.current
      //   );
      //   setApprover(approver);
      // }

      if (requestorId.current !== 0) {
        let requestor = approverArray.find(
          (ele) => ele.value === requestorId.current
        );
        setRequestor(requestor);
      }

      if (FYIUsersId.current !== undefined && FYIUsersId.current.length > 0) {
        let FYIUsersArr = [];
        FYIUsersId.current.forEach((element) => {
          let bindData = approverArray.find((ele) => ele.value === element);
          FYIUsersArr.push(bindData);
        });
        setFYIUsers(FYIUsersArr);
      }
    }
  };

  const leaveReasonApiCall = async () => {
    let postObject = {
      searchFor: "leaveReason",
      searchValue: 1,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data != undefined || data != null) {
      let leaveReasonArray = [];
      await data.map((leaveReason: any) => {
        let tempObj = {
          value: leaveReason.id,
          label: leaveReason.leavesReson,
        };
        leaveReasonArray.push(tempObj);
      });
      setLeaveReasonOptions(leaveReasonArray);
    }
  };

  const leaveTypeApiCall = async () => {
    let postObject = {
      searchFor: "leaveType",
      searchValue: 1,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    if (data != undefined || data != null || data.length > 0) {
      setLeaveTypeOptionsArr(data);
      setLeaveType(data[0]);
    }
  };

  const submitValidation = async () => {
    await setFormErrors({});
    if (!fromDate) {
      setFormErrors((preState) => ({
        ...preState,
        ["fromDate_isEmpty"]: "From date can not be empty",
      }));
      formErrorObj["fromDate_isEmpty"] = "From date can not be empty";
    }

    if (!toDate) {
      setFormErrors((preState) => ({
        ...preState,
        ["toDate_isEmpty"]: "To date can not be empty",
      }));
      formErrorObj["toDate_isEmpty"] = "To date can not be empty";
    }

    if (toDate < fromDate) {
      setFormErrors((preState) => ({
        ...preState,
        ["toDate_isEmpty"]: "To date can not be previous",
      }));
      formErrorObj["toDate_isEmpty"] = "To date can not be previous";
    }

    if (!leaveDays || leaveDays === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["leaveDays_isEmpty"]: "Leave days can not be empty",
      }));
      formErrorObj["leaveDays_isEmpty"] = "Leave days can not be empty";
    }
    // else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(leaveDays)) {
    //   setFormErrors((preState) => ({
    //     ...preState,
    //     ["leaveDays_isEmpty"]: "Leave days should have maximum 2 decimals only",
    //   }));
    //   formErrorObj["leaveDays_isEmpty"] =
    //     "Leave days should have maximum 2 decimals only";
    // }

    // if (!remark || remark === "" || remark.trim() === "") {
    //   setFormErrors((preState) => ({
    //     ...preState,
    //     ["remark_isEmpty"]: "Remark can not be empty",
    //   }));
    //   formErrorObj["remark_isEmpty"] = "Remark can not be empty";
    // }

    if (!requestor || Object.keys(requestor).length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["requestor_isEmpty"]: "Requestor can not be empty",
      }));
    }

    if (!approver || Object.keys(approver).length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["approver_isEmpty"]: "Approver can not be empty",
      }));
    }

    if (!fromDateLeaveType || Object.keys(fromDateLeaveType).length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["fromLeaveType_isEmpty"]: "Leave type can not be empty",
      }));
      formErrorObj["fromLeaveType_isEmpty"] = "Leave type can not be empty";
    }

    if (!toDateLeaveType || Object.keys(toDateLeaveType).length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["toLeaveType_isEmpty"]: "Leave type can not be empty",
      }));
      formErrorObj["toLeaveType_isEmpty"] = "Leave type can not be empty";
    }

    if (!leaveType || Object.keys(leaveType).length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["leaveType_isEmpty"]: "Leave type can not be empty",
      }));
      formErrorObj["leaveType_isEmpty"] = "Leave type can not be empty";
    }

    if (!leaveReason || Object.keys(leaveReason).length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["leaveReason_isEmpty"]: "Leave reason can not be empty",
      }));
      formErrorObj["leaveReason_isEmpty"] = "Leave reason can not be empty";
    }
    if (!leaveBalance || leaveBalance <= 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["leaveBalance_isEmpty"]: "Leave balance not be empty",
      }));
      formErrorObj["leaveBalance_isEmpty"] = "Leave balance not be empty";
    }
    if (!FYIUsers || FYIUsers.length === 0) {
      setFormErrors((preState) => ({
        ...preState,
        ["FYIUsers_isEmpty"]: "FYI Users can not be empty",
      }));
      formErrorObj["FYIUsers_isEmpty"] = "FYI Users can not be empty";
    }
  };

  const handleTextEvent = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "fromDate") {
      setFromDate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["fromDate_isEmpty"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["fromDate_isEmpty"]: "To date can not be empty",
        }));
      }
    }
    if (apiFieldName === "toDate") {
      setToDate(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["toDate_isEmpty"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["toDate_isEmpty"]: "To date can not be empty",
        }));
      }
    }
    if (apiFieldName === "leaveDays") {
      setLeaveDays(event.target.value);
      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["leaveDays_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["leaveDays_isEmpty"]: "Leave days can not be empty",
        }));
      }
    }
    if (apiFieldName === "remark") {
      setRemark(event.target.value);
      // if (
      //   event.target.value &&
      //   event.target.value !== "" &&
      //   event.target.value.trim() !== ""
      // ) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["remark_isEmpty"]: undefined,
      //   }));
      // } else if (
      //   !event.target.value ||
      //   event.target.value === "" ||
      //   event.target.value.trim() === ""
      // ) {
      //   setFormErrors((preState) => ({
      //     ...preState,
      //     ["remark_isEmpty"]: "remark can not be empty",
      //   }));
      // }
    }
  };

  const getEmployeeLeave = async () => {
    const { data } = await APICall(getEmployeeAvailableLeaveBalance, "POST", {
      EmployeeId: requestorId.current,
    });
    if (data > 0) {
      setLeaveBalance(data);
    }
  };
  const getApprover = async () => {
    if (state === null) {
      const { data } = await APICall(getEmployeeReportingManager, "POST", {
        EmployeeId: requestor.value,
      });
      if (data !== null && data !== 0) {
        approverId.current = data;
      } else if (data === 0) {
        setApprover({});
        notify(1, "No Reporting Manager is mapped for you, please contact HR");
      }
    }
  };

  const getPendingLeaves = async () => {
    if (state === null) {
      const res = await APICall(getPendingLeavesById, "POST", {
        requestorId: requestor.value,
      });
      if (res && res.status === 0 && res.data.length > 0) {
        let pendingDates = [];
        await res.data.map((ele) => {
          let tempObj = {
            fromDate: moment(ele.fromDate).format(moment.HTML5_FMT.DATE),
            toDate: moment(ele.toDate).format(moment.HTML5_FMT.DATE),
          };
          pendingDates.push(tempObj);
        });
        setPendingDates(pendingDates);
      }
    }
  };

  useEffect(() => {
    if (
      RoleIdArray.includes("3") ||
      RoleIdArray.includes("4")
      //|| RoleIdArray.includes("2")
    ) {
      setCanChangeRequestor(true);
    }
  }, [RoleIdArray]);

  useEffect(() => {
    requestorId.current = requestor.value;
    (async () => {
      await getApprover();
      await getEmployeeLeave();
      setPendingDates([]);
      await getPendingLeaves();
    })();
  }, [requestor.value]);

  useEffect(() => {
    (async () => {
      await getLeaveReqById();
      await approverApiCall();
      await leaveReasonApiCall();
      await leaveTypeApiCall();
    })();
  }, []);

  useEffect(() => {
    if (approverId.current !== 0) {
      let approver = approverOptions.find(
        (ele) => ele.value === approverId.current
      );
      setApprover(approver);
    }
  }, [approverId.current, approverOptions]);

  const submitFunc = async (action: any) => {
    let submitObj: any = {};
    if (action === "submit") {
      if (submitId !== 0 && state !== null) {
        let leaveStatus =
          (state.role === "self" && leaveStatusOnEdit === true && 4) ||
          (state.role !== "self" && leaveStatusOnEdit === true ? 1 : 2);
        submitObj = {
          Id: submitId,
          RequestStatus: leaveStatus,
        };
        // console.log(submitObj);
        await submitApiCall(submitObj);
      } else {
        submitObj = {
          RequestorId: requestor.value,
          ApproverId: approver.value,
          FYIUsersList: FYIUsers,
          FromDate: moment(fromDate).format(moment.HTML5_FMT.DATE),
          FromDateLeaveType: fromDateLeaveType.value,
          ToDate: moment(toDate).format(moment.HTML5_FMT.DATE),
          ToDateLeaveType: toDateLeaveType.value,
          LeaveDays: leaveDays,
          leaveType: leaveType.value,
          ResonId: leaveReason.value,
          Remark: remark === "" ? null : remark.trim(),
          RequestStatus: 3, //Pending by default when requesting leave
          IsActive: true,
          CreatedBy: Number(EmployeeId),
        };

        // console.log(submitObj);

        //check if leaves for same day;
        let isSameDayLeavePending = false;
        if (pendingDates.length > 0) {
          pendingDates.forEach((element) => {
            if (
              element.fromDate === submitObj.FromDate ||
              element.toDate === submitObj.ToDate
            ) {
              isSameDayLeavePending = true;
            }
          });
        }

        if (leaveDays > leaveBalance) {
          notify(1, "Leave days cannot be greater than leave balance!");
        } else if (isSameDayLeavePending) {
          notify(1, "Leave present for same day!");
        } else {
          await submitValidation();
          let isEmpty = Object.values(formErrorObj).every((f) => {
            f === "" || f === null || f === undefined;
          });
          if (isEmpty === true) {
            await submitApiCall(submitObj);
          }
        }
      }
    }
    if (action === "reset") {
      resetFunc();
    }
  };

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "requestor") {
      setRequestor(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["requestor_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["requestor_isEmpty"]: "Requestor can not be empty",
        }));
      }
    }

    if (apiFieldName === "approver") {
      setApprover(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["approver_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["approver_isEmpty"]: "Approver can not be empty",
        }));
      }
    }
    if (apiFieldName === "leaveType") {
      setLeaveType(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["leaveType_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["leaveType_isEmpty"]: "Leave type can not be empty",
        }));
      }
    }
    if (apiFieldName === "fromLeaveType") {
      setFromDateLeaveType(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["fromLeaveType_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["fromLeaveType_isEmpty"]: "Leave type can not be empty",
        }));
      }
    }
    if (apiFieldName === "toLeaveType") {
      setToDateLeaveType(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["toLeaveType_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["toLeaveType_isEmpty"]: "Leave type can not be empty",
        }));
      }
    }
    if (apiFieldName === "leaveReason") {
      setLeaveReason(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["leaveReason_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["leaveReason_isEmpty"]: "Leave reason can not be empty",
        }));
      }
    }
    if (apiFieldName === "FYIUsers") {
      setFYIUsers(event);
      if (event && Object.keys(event).length > 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["FYIUsers_isEmpty"]: undefined,
        }));
      } else if (!event || Object.keys(event).length === 0) {
        setFormErrors((preState) => ({
          ...preState,
          ["FYIUsers_isEmpty"]: "FYI Users can not be empty",
        }));
      }
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await APICall(getWorkPolicyHolidayList, "POST", {
        workPolicyId: Number(EmployeeWorkPolicyId),
      });
      if (data && data.length > 0) {
        let temp = [...data];
        temp = temp.filter((x) => x !== null);
        setHolidayList(temp);
      }
    })();
    (async () => {
      const { data } = await APICall(getWorkPolicyWorkdayList, "POST", {
        workPolicyId: Number(EmployeeWorkPolicyId),
      });
      if (data && data.length > 0) {
        let temp = [...data];
        temp = temp.filter((x) => x !== null);
        // console.log(temp);
        setWorkdayList(temp);
      }
    })();
  }, []);

  useEffect(() => {
    // Auto calculate leave days based on fromDate and toDate exclude sat & sun
    let FromDate = moment(fromDate);
    let ToDate = moment(toDate);

    let leaveDays;

    //function which exclude sat & sun
    function workday_count(start, end) {
      var first = start.clone().endOf("week"); // end of first week
      var last = end.clone().startOf("week"); // start of last week
      var days = (last.diff(first, "days") * 5) / 7; // this will always multiply of 7
      var wfirst = first.day() - start.day(); // check first week
      if (start.day() == 0) --wfirst; // -1 if start with sunday
      var wlast = end.day() - last.day(); // check last week
      if (end.day() == 6) --wlast; // -1 if end with saturday
      return wfirst + Math.floor(days) + wlast; // get the total
    }

    //function which include saturday
    function workday_count_sat(start, end) {
      var day = moment(start);
      var businessDays = 0;
      while (day.isSameOrBefore(end, "day")) {
        if (day.day() != 0) businessDays++;
        day.add(1, "d");
      }
      return businessDays;
    }
    if (workdayList.includes("Saturday")) {
      leaveDays = workday_count_sat(FromDate, ToDate);
    } else {
      leaveDays = workday_count(FromDate, ToDate);
    }
    if (!isNaN(leaveDays)) {
      //half day condition
      if (fromDateLeaveType.value === 2 || fromDateLeaveType.value === 3) {
        leaveDays = leaveDays - 0.5;
      }
      if (
        (toDateLeaveType.value === 2 || toDateLeaveType.value === 3) &&
        !ToDate.isSame(FromDate, "day")
      ) {
        leaveDays = leaveDays - 0.5;
      }
      setLeaveDays(leaveDays);
    }

    // find if holiday is there in between from and to date
    if (
      FromDate !== null &&
      ToDate !== null &&
      holidayList.length > 0 &&
      leaveDays > 0
    ) {
      let count = 0;
      holidayList.forEach((element) => {
        let range = moment(element).isBetween(
          FromDate,
          ToDate,
          undefined,
          "[]"
        );
        if (range) {
          count++;
        }
      });
      leaveDays = leaveDays - count;
      setLeaveDays(leaveDays);
    }
  }, [fromDate, toDate, fromDateLeaveType, toDateLeaveType]);

  return (
    <>
      <Heading title={"Request Leave /Report Absence"} />
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6 align-self-center">
              <div className="form-group">
                <label className="d-block">
                  From Date<sup>*</sup>
                </label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From date"
                    value={fromDate}
                    disabled={state !== null ? true : false}
                    onChange={(e) => handleTextEvent(e, "fromDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                    minDate={
                      state === null && requestor.value === Number(EmployeeId)
                        ? new Date()
                        : undefined
                    }
                  />
                </LocalizationProvider>
                <p style={{ color: "red" }}>{formErrors["fromDate_isEmpty"]}</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  From Date Leave Type<sup>*</sup>
                </label>
                <SelectForm
                  key={1}
                  disabled={state !== null ? true : false}
                  options={leaveTypeOptions}
                  placeholder="Select"
                  isDisabled={state !== null ? true : false}
                  value={fromDateLeaveType}
                  onChange={(event) => selectOnChange(event, "fromLeaveType")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
                <p style={{ color: "red" }}>
                  {formErrors["fromLeaveType_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 align-self-center">
              <div className="form-group">
                <label className="d-block">
                  To Date<sup>*</sup>
                </label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To date"
                    disabled={state !== null ? true : false}
                    value={toDate}
                    onChange={(e) => handleTextEvent(e, "toDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                    minDate={fromDate}
                  />
                </LocalizationProvider>
                <p style={{ color: "red" }}>{formErrors["toDate_isEmpty"]}</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  To Date Leave Type<sup>*</sup>
                </label>
                <SelectForm
                  key={1}
                  disabled={state !== null ? true : false}
                  options={leaveTypeOptions}
                  placeholder="Select"
                  isDisabled={state !== null ? true : false}
                  value={toDateLeaveType}
                  onChange={(event) => selectOnChange(event, "toLeaveType")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                  filterOption={(option) => option.value !== 3}
                />
                <p style={{ color: "red" }}>
                  {formErrors["toLeaveType_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Leave days<sup>*</sup>
                </label>
                <InputForm
                  placeholder={"Leave days"}
                  isDisabled={true}
                  textArea={false}
                  value={leaveDays}
                  onChange={(e) => handleTextEvent(e, "leaveDays")}
                  className="numRight"
                  type="number"
                  onKeyPress={(event) => {
                    if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
                <p style={{ color: "red" }}>
                  {formErrors["leaveDays_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Leave Balance<sup>*</sup>
                </label>
                <InputForm
                  placeholder={"Leave days"}
                  isDisabled={true}
                  textArea={false}
                  value={leaveBalance}
                  onChange={(e) => handleTextEvent(e, "leaveDays")}
                  className="numRight"
                  type="number"
                  onKeyPress={(event) => {
                    if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
                <p style={{ color: "red" }}>
                  {formErrors["leaveBalance_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Leave Type<sup>*</sup>
                </label>
                <SelectForm
                  options={leaveTypeOptionsArr}
                  placeholder="Select"
                  isDisabled={state !== null ? true : false}
                  value={leaveType}
                  onChange={(event) => selectOnChange(event, "leaveType")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
                <p style={{ color: "red" }}>
                  {formErrors["leaveType_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Leave Reason<sup>*</sup>
                </label>
                <SelectForm
                  key={1}
                  options={leaveReasonOptions}
                  placeholder="Select"
                  isDisabled={state !== null ? true : false}
                  value={leaveReason}
                  onChange={(event) => selectOnChange(event, "leaveReason")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
                <p style={{ color: "red" }}>
                  {formErrors["leaveReason_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Requestor<sup>*</sup>
                </label>
                <SelectForm
                  options={approverOptions}
                  placeholder="Select"
                  isDisabled={
                    state !== null
                      ? true
                      : false || canChangeRequestor
                      ? false
                      : true
                  }
                  value={requestor}
                  onChange={(event) => selectOnChange(event, "requestor")}
                  noIndicator={false}
                  noSeparator={false}
                />
                <p style={{ color: "red" }}>
                  {formErrors["requestor_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Approver<sup>*</sup>
                </label>
                <SelectForm
                  options={approverOptions}
                  placeholder="Select"
                  isDisabled={true}
                  value={approver}
                  onChange={(event) => selectOnChange(event, "approver")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
                <p style={{ color: "red" }}>{formErrors["approver_isEmpty"]}</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  FYI Users<sup>*</sup>
                </label>
                <SelectForm
                  options={approverOptions}
                  placeholder="Select"
                  isDisabled={state !== null ? true : false}
                  value={FYIUsers}
                  onChange={(event) => selectOnChange(event, "FYIUsers")}
                  isMulti={true}
                  noIndicator={false}
                  noSeparator={false}
                />
                <p style={{ color: "red" }}>{formErrors["FYIUsers_isEmpty"]}</p>
              </div>
            </div>
            {state !== null && state.role !== "viewer" && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>
                    {state.role !== "self" ? "Approve Leave" : "Cancel Leave"}
                    <sup>*</sup>
                  </label>
                  <br />

                  <label
                    htmlFor="custom-switch"
                    style={{ float: "left" }}
                    className="mr-2"
                  >
                    No
                  </label>
                  <Form style={{ float: "left" }}>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label=""
                      // disabled={state && state.role === "viewer" ? true : false}
                      onChange={(e) => setLeaveStatusOnEdit(e.target.checked)}
                      checked={leaveStatusOnEdit}
                    />
                  </Form>
                  <label
                    htmlFor="custom-switch"
                    style={{ float: "left" }}
                    className="ml-2"
                  >
                    Yes
                  </label>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="form-group">
                  <label>Remark</label>
                  <InputForm
                    placeholder={"Remark"}
                    isDisabled={state !== null ? true : false}
                    textArea={true}
                    value={remark}
                    rows={4}
                    onChange={(e) => handleTextEvent(e, "remark")}
                  />
                  {/* <p style={{ color: "red" }}>{formErrors["remark_isEmpty"]}</p> */}
                </div>
              </div>

              {/* <div className="col-lg-3 col-md-4 col-sm-6 align-self-end">
                <div className="form-group">
                  <input
                    type="checkbox"
                    onChange={(e) => setIsActive(e.target.checked)}
                    name="isActive"
                    checked={isActive}
                  />
                </div>
              </div> */}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              onClick={() => submitFunc("reset")}
              className="btn btn-reset ml-1"
              disabled={state !== null ? true : false}
            >
              Reset
            </button>
            <button
              style={{ background: "#96c61c" }}
              onClick={() => submitFunc("submit")}
              className="btn btn-save ml-1"
              disabled={
                approverId.current === 0
                  ? true
                  : false ||
                    (state !== null &&
                      state.role === "self" &&
                      leaveStatusOnEdit === false)
                  ? true
                  : false || (state !== null && state.role === "viewer")
                  ? true
                  : false
              }
            >
              Submit
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Back
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default LeaveRequestMasterEdit;
