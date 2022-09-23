import React, { useEffect, useState } from "react";
import "./CostCenterMaster.css";
import { useLocation, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  getCostCenterByIdUrl,
  InsertUpdateCostCenterMasterData,
  CheckIfCostCenterExists,
} from "../../../Helpers/API/APIEndPoints";
import InputForm from "../../../Components/InputForm/InputForm";
import notify from "../../../Helpers/ToastNotification";
import Heading from "../../../Components/Heading/Heading";

const CostCenterEdit = () => {
  let navigate = useNavigate();
  const { state } = useLocation();

  const [costCenterData, setCostCenterData] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    (async () => {
      if (state !== null) {
        let post = {
          id: state,
        };

        const { data } = await APICall(getCostCenterByIdUrl, "POST", post);

        if (data !== null || typeof data !== "string") {
          setCostCenterData(data.costCenter1);
          setIsActive(data.isActive);
        }
      }
    })();
  }, []);

  const postData = async () => {
    let data;
    if (state !== null) {
      data = {
        id: state,
        costCenter1: costCenterData.trim(),
        isActive: isActive,
      };
    } else {
      data = {
        costCenter1: costCenterData.trim(),
        isActive: isActive,
      };
    }

    if (data.costCenter1 === "") {
      notify(1, "Please fill required fields!");
    }
    if (data.costCenter1 === "") {
      notify(2, "Record is already Exist");
    } else {
      const res = await APICall(InsertUpdateCostCenterMasterData, "POST", data);
      if (res.status === 1) {
        notify(res.status, res.message);
      }
      const res1 = await APICall(CheckIfCostCenterExists, "POST", {
        costCenter1: costCenterData,
      });
      if (res1.status === 2) {
        notify(res.status, res.message);
      } else {
        navigate(-1);
      }
    }
  };

  return (
    <>
      <div>
        <Heading title={"Cost Center Master"} />
      </div>
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Cost Center<sup>*</sup>
                </label>
                <InputForm
                  placeholder={"Name"}
                  isDisabled={false}
                  textArea={false}
                  value={costCenterData}
                  onChange={(e) => setCostCenterData(e.target.value)}
                />
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
              onClick={() => setCostCenterData("")}
              className="btn btn-reset ml-1">
              Reset
            </button>
            <button
              style={{ background: "#96c61c" }}
              onClick={postData}
              className="btn btn-save ml-1">
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

export default CostCenterEdit;
