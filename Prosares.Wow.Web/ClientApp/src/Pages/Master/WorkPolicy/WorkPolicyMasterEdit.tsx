import React, { useEffect, useState } from "react";
import "./WorkPolicyMaster.css";
import { useLocation, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  getWorkPolicyByIdUrl,
  InsertUpdateWorkPolicyData,
  CheckIfWorkPolicyExists,
} from "../../../Helpers/API/APIEndPoints";
import InputForm from "../../../Components/InputForm/InputForm";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Heading from "../../../Components/Heading/Heading";
import moment from "moment";
import notify from "../../../Helpers/ToastNotification";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import HolidayDates from "../../../Components/HolidayDates/HolidayDates";

const WorkPolicyMasterEdit = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [workPolicyId, setWorkPolicyId] = useState();
  const [workPolicyName, setWorkPolicyName] = useState("");
  const [validFrom, setValidFrom] = React.useState<Date | null>(null);
  const [validTill, setValidTill] = React.useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [holidayDates, setHolidayDates] = useState([]);
  const [workingDaysList, setWorkingDaysList] = useState([]);
  let formErrorObj = {};

  //get the data from the selected workpolicy by Id
  const getWorkpolicyById = async () => {
    if (state !== null) {
      let post = {
        id: state,
      };

      const { data } = await APICall(getWorkPolicyByIdUrl, "POST", post);

      if (data !== null || typeof data !== "string") {
        setWorkPolicyId(data.id);
        setWorkPolicyName(data.policyName);
        setIsActive(data.isActive);
        setValidFrom(data.validFrom);
        setValidTill(data.validTill);

        let arr = [];
        let arr2 = [];

        if (data.holiday1 !== null) {
          arr.push(moment(data.holiday1).format(moment.HTML5_FMT.DATE));
        }

        if (data.holiday2 !== null) {
          arr.push(moment(data.holiday2).format(moment.HTML5_FMT.DATE));
        }

        if (data.holiday3 !== null) {
          arr.push(moment(data.holiday3).format(moment.HTML5_FMT.DATE));
        }

        if (data.holiday4 !== null) {
          arr.push(moment(data.holiday4).format(moment.HTML5_FMT.DATE));
        }

        if (data.holiday5 !== null) {
          arr.push(moment(data.holiday5).format(moment.HTML5_FMT.DATE));
        }

        if (data.holiday6 !== null) {
          arr.push(moment(data.holiday6).format(moment.HTML5_FMT.DATE));
        }

        if (data.holiday7 !== null) {
          arr.push(moment(data.holiday7).format(moment.HTML5_FMT.DATE));
        }

        if (data.holiday8 !== null) {
          arr.push(moment(data.holiday8).format(moment.HTML5_FMT.DATE));
        }

        if (data.holiday9 !== null) {
          arr.push(moment(data.holiday9).format(moment.HTML5_FMT.DATE));
        }

        if (data.holiday10 !== null) {
          arr.push(moment(data.holiday10).format(moment.HTML5_FMT.DATE));
        }
        if (data.holiday11 !== null) {
          arr.push(moment(data.holiday11).format(moment.HTML5_FMT.DATE));
        }

        if (data.workingDay1 !== null) {
          arr2.push({ value: data.workingDay1, label: data.workingDay1 });
        }

        if (data.workingDay2 !== null) {
          arr2.push({ value: data.workingDay2, label: data.workingDay2 });
        }

        if (data.workingDay3 !== null) {
          arr2.push({ value: data.workingDay3, label: data.workingDay3 });
        }

        if (data.workingDay4 !== null) {
          arr2.push({ value: data.workingDay4, label: data.workingDay4 });
        }

        if (data.workingDay5 !== null) {
          arr2.push({ value: data.workingDay5, label: data.workingDay5 });
        }

        if (data.workingDay6 !== null) {
          arr2.push({ value: data.workingDay6, label: data.workingDay6 });
        }

        setHolidayDates(arr);
        setWorkingDaysList(arr2);
      }
    }
  };

  const options = [
    { value: "Monday", label: "Monday", id: 1 },
    { value: "Tuesday", label: "Tuesday", id: 2 },
    { value: "Wednesday", label: "Wednesday", id: 3 },
    { value: "Thursday", label: "Thursday", id: 4 },
    { value: "Friday", label: "Friday", id: 5 },
    { value: "Saturday", label: "Saturday", id: 6 },
    { value: "Sunday", label: "Sunday", id: 7 },
  ];

  useEffect(() => {
    getWorkpolicyById();
  }, []);

  const getDataOnSubmit = async (requestObject: any) => {
    if (requestObject !== null) {
      const res = await APICall(
        InsertUpdateWorkPolicyData,
        "POST",
        requestObject
      );
      if (res.status === 1) {
        notify(res.status, res.message);
      } else {
        navigate(-1);
      }
    }
  };

  const onClickFunction = async (action) => {
    let sortedHolidayList = holidayDates.sort();
    if (action === "submit") {
      let requestObject = {
        id: workPolicyId,
        policyName: workPolicyName,
        validFrom: moment(validFrom).format(moment.HTML5_FMT.DATE),
        validTill: moment(validTill).format(moment.HTML5_FMT.DATE),
        HolidayDates: sortedHolidayList,
        WorkingDates: workingDaysList,
        isActive: isActive,
      };

      //submitApiCall
      if (workPolicyId !== 0) {
        requestObject.id = workPolicyId;
      }

      let ero = await submitValidation();
      const isEmpty = await Object.values(formErrorObj).every(
        (x) => x === null || x === "" || x == undefined
      );

      if (isEmpty === true) {
        await getDataOnSubmit(requestObject);
      }
    }

    if (action === "reset") {
      setFormErrors({});
      setWorkPolicyName("");
      setValidFrom(null);
      setValidTill(null);
      setHolidayDates([]);
      setWorkingDaysList([]);
    }
  };

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "validFrom") {
      setValidFrom(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["validFrom_isEmpty"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["validFrom_isEmpty"]: "Valid From date can not be empty",
        }));
      }
    }
    if (apiFieldName === "validTill") {
      setValidTill(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["validTill_isEmpty"]: undefined,
          ["Invalid Date"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["validTill_isEmpty"]: "Valid From date can not be empty",
        }));
      }
    }

    if (apiFieldName === "workPolicyName") {
      if (event.target.value.length < 10) {
        setWorkPolicyName(event.target.value);
      }

      if (
        event.target.value &&
        event.target.value !== "" &&
        event.target.value.toString().trim() !== ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["workPolicyName_isEmpty"]: undefined,
        }));
      } else if (
        !event.target.value ||
        event.target.value === "" ||
        event.target.value.toString().trim() === ""
      ) {
        setFormErrors((preState) => ({
          ...preState,
          ["workPolicyName_isEmpty"]: "Valid From date can not be empty",
        }));
      }
    }

    if (apiFieldName === "workingDaylist") {
      setWorkingDaysList(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["workingDaysList_isEmpty"]: undefined,
          ["workingDaysList_5"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["workingDaysList_5"]: "Working Day cannot be less than 5",
        }));
      }
    }
  };

  const submitValidation = async () => {
    var objError = {};

    await setFormErrors({});

    if (!workPolicyName) {
      setFormErrors((preState) => ({
        ...preState,
        ["workPolicyName_isEmpty"]: "Work Policy Name can not be empty",
      }));
    }

    const data = await APICall(CheckIfWorkPolicyExists, "POST", {
      policyName: workPolicyName,
    });
    if (data.data != undefined || data.data != null) {
      if (data.data === true && state == null) {
        objError["WorkPolicy_exists"] = "WorkPolicy already exists";
      }
    }
    if (
      workPolicyName == undefined ||
      workPolicyName == null ||
      workPolicyName == ""
    ) {
      objError["workPolicyName_isEmpty"] = "Work Policy Name can not be empty";
    }

    if (validFrom == undefined || validFrom == null) {
      objError["validFrom_isEmpty"] = "Valid From date can not be empty";
    }

    if (validTill == undefined || validTill == null) {
      objError["validTill_isEmpty"] = "Valid Till date can not be empty";
    }

    if (workingDaysList.length < 5) {
      objError["workingDaysList_5"] = "Working Day cannot be less than 5";
    }

    if (holidayDates.length < 9) {
      objError["LeastHolidays"] = "9 Holidays are mandatory!";
    }

    formErrorObj = objError;
    await setFormErrors(objError);
  };

  return (
    <div>
      <Heading title={"Work Policy Master"} />
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Work Policy Name<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={workPolicyName}
                  onChange={(e) => setWorkPolicyName(e.target.value)}
                />
                <p style={{ color: "red" }}>
                  {formErrors["WorkPolicy_exists"]}
                  {formErrors["workPolicyName_isEmpty"]}
                </p>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 align-self-end">
              <div className="form-group">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="valid From"
                    value={validFrom}
                    onChange={(e) => selectOnChange(e, "validFrom")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" required {...params} />
                    )}
                  />
                </LocalizationProvider>
                <p style={{ color: "red" }}>
                  {formErrors["validFrom_isEmpty"]}
                </p>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 align-self-end">
              <div className="form-group">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="valid Till"
                    value={validTill}
                    onChange={(e) => selectOnChange(e, "validTill")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" required {...params} />
                    )}
                  />
                </LocalizationProvider>
                <p style={{ color: "red" }}>
                  {formErrors["validTill_isEmpty"]}
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Working days<sup>*</sup>
                </label>
                <SelectForm
                  value={workingDaysList}
                  onChange={(e) => selectOnChange(e, "workingDaylist")}
                  options={options}
                  isMulti
                  isSearchable={false}
                  isClearable={true}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  placeholder="Select Working Days"
                />
                <p style={{ color: "red" }}>
                  {formErrors["workingDaysList_5"]}
                </p>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 align-self-end">
              <div className="form-group">
                <label htmlFor="isActive" className="d-inline-block mr-2">
                  Is Active
                </label>
                <input
                  type="checkbox"
                  id="isActive"
                  onChange={(e) => setIsActive(e.target.checked)}
                  name="isActive"
                  checked={isActive}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                {/* <label>
                  Select Holidays<sup>*</sup>
                </label> */}
                <HolidayDates
                  setHolidayDates={setHolidayDates}
                  Dates={holidayDates}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              onClick={() => onClickFunction("reset")}
              className="btn btn-reset ml-1">
              Reset
            </button>
            <button
              style={{ background: "#96c61c" }}
              onClick={() => onClickFunction("submit")}
              className="btn btn-save ml-1">
              Submit
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Back
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkPolicyMasterEdit;
