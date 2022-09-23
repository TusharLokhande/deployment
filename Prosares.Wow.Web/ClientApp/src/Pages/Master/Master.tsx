import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SelectForm from "../../Components/SelectForm/SelectForm";

const Master = () => {
  let navigate = useNavigate();
  const [select, onSelect] = useState({ value: 1, label: "Customer" });

  // useEffect(() => {
  //   switch (select.value) {
  //     case 1:
  //       navigate("/master/customer", {
  //         replace: true,
  //       });
  //       break;

  //     case 2:
  //       navigate("/master/employee", { replace: true });
  //       break;

  //     case 3:
  //       navigate("/master/milestone", { replace: true });
  //       break;

  //     default:
  //       break;
  //   }
  // }, [select]);

  return (
    <>
      {/* <div className="p-3 w-25">
        <SelectForm
          options={[
            {
              value: 1,
              label: "Customer",
            },
            {
              value: 2,
              label: "Employee",
            },
            {
              value: 3,
              label: "Milestone",
            },
          ]}
          placeholder="Select"
          isDisabled={false}
          value={select}
          onChange={onSelect}
          isMulti={false}
          noIndicator={false}
          noSeparator={false}
        />
      </div> */}
      <Outlet />
    </>
  );
};

export default Master;
