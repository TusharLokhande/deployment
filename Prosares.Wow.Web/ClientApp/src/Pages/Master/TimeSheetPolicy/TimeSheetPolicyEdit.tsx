import React, { useState, useEffect } from "react";
import Heading from "../../../Components/Heading/Heading";
import InputForm from "../../../Components/InputForm/InputForm";
import {
  insertUpdateTimeSheetPolicyData,
  getTimeSheetPolicyDataById,
} from "../../../Helpers/API/APIEndPoints";
import { APICall } from "../../../Helpers/API/APICalls";
import { useLocation, useNavigate } from "react-router-dom";
import notify from "../../../Helpers/ToastNotification";
import { getContext } from "../../../Helpers/Context/Context";

const TimeSheetPolicyEdit = () => {
  let navigate = useNavigate();
  const context = getContext();
  const { state } = useLocation();
  const [policyName, setPolicyName] = useState("");
  const [isTimeSheetApplicable, setIsTimeSheetApplicable] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [timesheetPolicyId, setTimeSheetPolicyId] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [createdBy, setCreatedBy] = useState("");
  const [modifyBy, setModifyBy] = useState("");

  useEffect(() => {
    getTimeSheetPolicyById();
  }, []);

  let formErrorObj = {};

  //  Validation
  const submitValidation = async () => {
    var objError = {};

    await setFormErrors({});

    if (policyName === "" || policyName === null) {
      objError["e"] = "Timesheet policy cannot be empty";
    }

    formErrorObj = objError;
    setFormErrors(objError);
  };

  const getTimeSheetPolicyById = async () => {
    if (state !== null) {
      let post = {
        id: state,
      };
      const { data } = await APICall(getTimeSheetPolicyDataById, "POST", post);
      //isActive , isTimeSheetApplicable , id
      if (data !== null || typeof data !== "string") {
        setTimeSheetPolicyId(data.id);
        setIsActive(data.isActive);
        setIsTimeSheetApplicable(data.isTimeSheetApplicable);
        setPolicyName(data.name);
        setCreatedBy(data.createdBy);
      }
    }
  };

  const getDataOnSubmit = async (requestObject: any) => {
    if (requestObject !== null) {
      const res = await APICall(
        insertUpdateTimeSheetPolicyData,
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

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "policyName") {
      if (event.target.value.length < 50) {
        setPolicyName(event.target.value);
      }
      setFormErrors({});
    }
  };

  const onClickFunction = async (action) => {
    if (action === "submit") {
      let data = {
        Id: timesheetPolicyId,
        Name: policyName.trim(),
        IsActive: isActive,
        IsTimeSheetApplicable: isTimeSheetApplicable,
      };

      timesheetPolicyId > 0
        ? (data["ModifiedBy"] = context.id)
        : (data["CreatedBy"] = context.id);

      let ero = await submitValidation();

      const isEmpty = await Object.values(formErrorObj).every(
        (x) => x === null || x === "" || x == undefined
      );

      if (isEmpty === true) {
        await getDataOnSubmit(data);
      }
    }

    if (action === "reset") {
      setPolicyName("");
      setIsActive(false);
      setIsTimeSheetApplicable(false);
      setFormErrors({});
    }
  };

  return (
    <div>
      <Heading title={"Work Policy Master"} />
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>Timepolicy Sheet Name</label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={policyName}
                  onChange={(e) => selectOnChange(e, "policyName")}
                />
                <div>
                  <p style={{ color: "red" }}>
                    {formErrors["d"]}
                    {formErrors["e"]}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6 align-self-end">
              <div className="form-group">
                <label
                  htmlFor="isTimeSheetApplicable"
                  className="d-inline-block mr-2">
                  isTimeSheetApplicable
                </label>
                <input
                  type="checkbox"
                  id="isTimeSheetApplicable"
                  onChange={(e) => setIsTimeSheetApplicable(e.target.checked)}
                  name="isTimeSheetApplicable"
                  checked={isTimeSheetApplicable}
                />
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
              <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary">
                Back
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TimeSheetPolicyEdit;
