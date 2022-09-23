import React, { useEffect, useState } from "react";
import "./PhaseMaster.css";
import { useLocation, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  GetDropDownList,
  getPhaseByIdUrl,
  InsertUpdatePhaseMasterData,
} from "../../../Helpers/API/APIEndPoints";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import InputForm from "../../../Components/InputForm/InputForm";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toDate } from "date-fns";
import moment from "moment";
import notify from "../../../Helpers/ToastNotification";
import Heading from "../../../Components/Heading/Heading";

const PhaseMasterEdit = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [phaseId, setPhaseId] = useState();
  const [phase, setPhase] = useState("");
  const [description, setDescription] = useState("");
  const [engagement, setEngagement] = useState<any>([]);
  const [plannedDate, setPlannedDate] = React.useState<Date | null>(null);
  const [actualDate, setActualDate] = React.useState<Date | null>(null);
  const [phaseEngagementOption, setPhaseEngagementOption] = useState<any>([]);
  const [isActive, setIsActive] = useState(true);

  //get the data from the selected phase by Id
  const getPhaseById = async () => {
    if (state !== null) {
      let post = {
        id: state,
      };

      const { data } = await APICall(getPhaseByIdUrl, "POST", post);

      if (data !== null || typeof data !== "string") {
        setPhaseId(data[0].id);
        setPhase(data[0].phase);
        setDescription(data[0].description);
        setEngagement({
          value: data[0].engagementId,
          label: data[0].engagement,
        });
        setIsActive(data[0].isActive);
        setPlannedDate(data[0].plannedDate);
        setActualDate(data[0].actualDate);
      }
    }
  };

  useEffect(() => {
    getPhaseById();
    getEngagementData();
  }, []);

  const CommonDropdownFunction = async (searchFor, searchValue) => {
    let postObject = {
      searchFor: searchFor,
      searchValue: searchValue,
    };
    const { data } = await APICall(GetDropDownList, "POST", postObject);
    return data;
  };

  //Engagement Dropdown
  const getEngagementData = async () => {
    let engagementId = 1; //hardcoded
    var data = await CommonDropdownFunction(
      "engagementMasterOnly",
      engagementId
    );

    if (data != undefined || data != null) {
      let engagementArray = [];
      await data.map((engagement) => {
        let tempObj = {
          value: engagement.id,
          label: engagement.engagement,
        };
        engagementArray.push(tempObj);
      });

      setPhaseEngagementOption(engagementArray);
    }
  };

  const getDataOnSubmit = async (requestObject: any) => {
    if (requestObject !== null) {
      const res = await APICall(
        InsertUpdatePhaseMasterData,
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

  const checkValidation = (requestObject) => {
    const checkArr = [
      "phase",
      "description",
      "engagementId",
      "plannedDate",
      "actualDate",
    ];

    let validator = false;

    for (let i = 0; i < checkArr.length; i++) {
      if (
        requestObject[checkArr[i]] === "" ||
        requestObject[checkArr[i]] === undefined ||
        requestObject[checkArr[i]] === null
      ) {
        validator = true;
        break;
      }
    }

    return validator;
  };

  const onClickFunction = async (action) => {
    if (action === "submit") {
      let requestObject = {
        id: phaseId,
        phase: phase,
        description: description,
        engagementId: engagement && engagement.value,
        plannedDate: plannedDate,
        actualDate: actualDate,
        isActive: isActive,
        //CreatedDate: moment(new Date()).format(),
        //CreatedBy: 1//
      };

      //submitApiCall
      const validate = checkValidation(requestObject);
      if (validate) {
        notify(1, "Please fill required fields!");
      } else {
        await getDataOnSubmit(requestObject);
      }
    }

    if (action === "reset") {
      setPhase("");
      setDescription("");
      setEngagement(null);
      setPlannedDate(null);
      setActualDate(null);
    }
  };

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "engagement") {
      setEngagement(event);
    }
    if (apiFieldName === "plannedDate") {
      setPlannedDate(event);
    }
    if (apiFieldName === "actualDate") {
      setActualDate(event);
    }
  };

  return (
    <div>
      <Heading title={"Phase Master"} />
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Phase Name<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Phase Description<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Engagement<sup>*</sup>
                </label>
                <SelectForm
                  options={phaseEngagementOption}
                  placeholder="Select"
                  isDisabled={false}
                  value={engagement}
                  onChange={(event) => selectOnChange(event, "engagement")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Planned Date"
                    value={plannedDate}
                    onChange={(e) => selectOnChange(e, "plannedDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" required {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Actual Date"
                    value={actualDate}
                    onChange={(e) => selectOnChange(e, "actualDate")}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" required {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6 align-self-end">
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

export default PhaseMasterEdit;
