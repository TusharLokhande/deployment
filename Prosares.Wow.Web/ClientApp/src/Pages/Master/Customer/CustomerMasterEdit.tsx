import React, { useEffect, useState } from "react";
import "./CustomerMaster.css";
import { useLocation, useNavigate } from "react-router-dom";
import { APICall } from "../../../Helpers/API/APICalls";
import {
  getCustomerDataByIdUrl,
  insertUpdateCustomerDataUrl,
} from "../../../Helpers/API/APIEndPoints";
import InputForm from "../../../Components/InputForm/InputForm";
import notify from "../../../Helpers/ToastNotification";
import { getContext } from "../../../Helpers/Context/Context";
import Heading from "../../../Components/Heading/Heading";

const CustomerMasterEdit = () => {
  let navigate = useNavigate();
  const { EmployeeId } = getContext();
  const { state } = useLocation();
  const [customerName, setCustomerName] = useState("");
  const [customerAbb, setCustomerAbb] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [createdDate, setCreatedDate] = useState(null);

  useEffect(() => {
    (async () => {
      if (state !== null) {
        let post = {
          id: state,
        };

        const { data } = await APICall(getCustomerDataByIdUrl, "POST", post);

        if (data !== null || typeof data !== "string") {
          setCustomerName(data.name);
          setCustomerAbb(data.abbreviation);
          setIsActive(data.isActive);
          setCreatedDate(data.createdDate);
        }
      }
    })();
  }, []);

  const postData = async () => {
    let data;

    if (state !== null) {
      data = {
        id: state,
        name: customerName.trim(),
        abbreviation: customerAbb.trim(),
        isActive: isActive,
        createdDate: new Date(createdDate),
        modifiedDate: new Date(),
        CreatedBy: EmployeeId,
      };
    } else {
      data = {
        name: customerName.trim(),
        abbreviation: customerAbb.trim(),
        ModifiedBy: EmployeeId,
        isActive: isActive,
      };
    }

    const validAbb = new RegExp(/^\S*$/);
    if (data.name === "" || data.abbreviation === "") {
      notify(1, "Please fill required fields!");
    } else if (!validAbb.test(data.abbreviation)) {
      notify(1, "Abbreviation should not contain space");
    } else if (data.abbreviation.length > 8) {
      notify(1, "Abbreviation should not contain more than 8 characters");
    } else {
      const res = await APICall(insertUpdateCustomerDataUrl, "POST", data);
      if (res.status === 1) {
        notify(res.status, res.message);
      } else {
        navigate(-1);
      }
    }
  };

  return (
    <>
      <Heading title={"Customer Master"} />
      <section className="main_content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Name<sup>*</sup>
                </label>
                <InputForm
                  placeholder={"Name"}
                  isDisabled={false}
                  textArea={false}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-group">
                <label>
                  Abbreviation<sup>*</sup>
                </label>
                <InputForm
                  placeholder={"Abbreviation"}
                  isDisabled={false}
                  textArea={false}
                  value={customerAbb}
                  onChange={(e) => setCustomerAbb(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 align-self-end">
              <div className="form-group">
                <label htmlFor="isActive" className="d-inline-block mr-2">
                  Is Active
                </label>
                <input
                  id="isActive"
                  type="checkbox"
                  onChange={(e) => setIsActive(e.target.checked)}
                  name="isActive"
                  checked={isActive}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              onClick={() => {
                setCustomerName("");
                setCustomerAbb("");
              }}
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

export default CustomerMasterEdit;
