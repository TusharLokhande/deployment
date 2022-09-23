import React, { useEffect, useState } from "react";
import "./ApplicationMaster.css";
import { useLocation, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  GetDropDownList,
  getApplicationByIdUrl,
  InsertUpdateApplicationMasterData,
  CheckIfApplicationExists,
} from "../../../Helpers/API/APIEndPoints";
import SelectForm from "../../../Components/SelectForm/SelectForm";
import InputForm from "../../../Components/InputForm/InputForm";
import Heading from "../../../Components/Heading/Heading";
import notify from "../../../Helpers/ToastNotification";

const ApplicationMasterEdit = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [applicationId, setApplicationId] = useState();
  const [application, setApplication] = useState("");
  const [engagement, setEngagement] = useState<any>({});
  const [
    applicationEngagementOption,
    setApplicationEngagementOption,
  ] = useState<any>([]);
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  let formErrorObj = {};

  const getApplicationById = async () => {
    if (state !== null) {
      let post = {
        id: state,
      };

      const { data } = await APICall(getApplicationByIdUrl, "POST", post);

      if (data !== null || typeof data !== "string") {
        setApplicationId(data[0].id);
        setApplication(data[0].application);
        setEngagement({
          value: data[0].engagementID,
          label: data[0].engagement,
        });
        setIsActive(data[0].isActive);
      }
    }
  };

  useEffect(() => {
    getApplicationById();
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

      setApplicationEngagementOption(engagementArray);
    }

    if (data != undefined || data != null) {
      let engagementArray = [];
      await data.map((engagement) => {
        let tempObj = {
          value: engagement.id,
          label: engagement.engagement,
        };
        engagementArray.push(tempObj);
      });

      setApplicationEngagementOption(engagementArray);
    }
  };

  const getDataOnSubmit = async (requestObject: any) => {
    if (requestObject !== null) {
      const res = await APICall(
        InsertUpdateApplicationMasterData,
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
    if (action === "submit") {
      let requestObject = {
        id: applicationId,
        application: application,
        engagementId: engagement.value,
        isActive: isActive,
      };
      //submitApiCall
      if (applicationId !== 0) {
        requestObject.id = applicationId;
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
      setApplication("");
      setEngagement(null);
    }
  };

  const selectOnChange = async (event: any, apiFieldName: any) => {
    if (apiFieldName === "engagement") {
      setEngagement(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["engagement_isEmpty"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["engagement_isEmpty"]: "Engagement can not be empty",
        }));
      }
    }

    if (apiFieldName === "application") {
      setApplication(event);
      if (event) {
        setFormErrors((preState) => ({
          ...preState,
          ["applicationName_isEmpty"]: undefined,
        }));
      } else {
        setFormErrors((preState) => ({
          ...preState,
          ["applicationName_isEmpty"]: "Application Name can not be empty",
        }));
      }
    }
  };

  const submitValidation = async () => {
    var objError = {};
    await setFormErrors({});

    const data = await APICall(CheckIfApplicationExists, "POST", {
      application: application,
    });
    if (data.data != undefined || data.data != null) {
      if (data.data === true && state == null) {
        objError["ApplicationName_exists"] = "Application Name already exists";
      }
    }
    if (application == undefined || application == null || application == "") {
      objError["applicationName_isEmpty"] = "Application Name can not be empty";
    }

    if (
      Object.keys(engagement).length === 0 ||
      engagement == undefined ||
      engagement == null
    ) {
      objError["engagement_isEmpty"] = "Engagement can not be empty";
    }

    formErrorObj = objError;
    await setFormErrors(objError);
  };

  return (
    <div>
      <Heading title={"Application Master"} />
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Application Name<sup>*</sup>
                </label>
                <InputForm
                  placeholder={""}
                  isDisabled={false}
                  textArea={false}
                  value={application}
                  onChange={(e) =>
                    selectOnChange(e.target.value, "application")
                  }
                />
                <p style={{ color: "red" }}>
                  {formErrors["ApplicationName_exists"]}
                  {formErrors["applicationName_isEmpty"]}
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Engagement<sup>*</sup>
                </label>
                <SelectForm
                  options={applicationEngagementOption}
                  placeholder="Select"
                  isDisabled={false}
                  value={engagement}
                  onChange={(event) => selectOnChange(event, "engagement")}
                  isMulti={false}
                  noIndicator={false}
                  noSeparator={false}
                />
                <p style={{ color: "red" }}>
                  {formErrors["engagement_isEmpty"]}
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 align-self-end">
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
              className="btn btn-reset ml-1"
            >
              Reset
            </button>
            <button
              style={{ background: "#96c61c" }}
              onClick={() => onClickFunction("submit")}
              className="btn btn-save ml-1"
            >
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

export default ApplicationMasterEdit;
