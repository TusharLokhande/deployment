import React, { useState } from "react";
import { Form } from "react-bootstrap";

function PunchInOut() {
    const [isPunchedIn, setIsPunchedIn] = useState<any>(false);
    

    const handleCheckEvent =(isChecked)=>{
        
    }
  return (
    <>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="form-group">
          <label>Punch In/Out</label>
          <br />
         
          <Form style={{ float: "left" }}>
            <Form.Check
              type="switch"
              id="custom-switch"
              label=""
              onChange={(e) =>
                handleCheckEvent(e.target.checked)
              }
              checked={isPunchedIn}
            />
          </Form>
        
        </div>
      </div>
    </>
  );
}

export default PunchInOut;
