import React, { useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Bubble.css";

const Bubble = () => {
  const [env, setEnv] = useState<any>(
    process.env.REACT_APP_PUBLISH_PATH ? process.env.REACT_APP_PUBLISH_PATH : ""
  );

  return (
    <>
      <OverlayTrigger
        trigger="click"
        placement="left"
        rootClose
        overlay={
          <Popover>
            <Popover.Body style={{ backgroundColor: "#96c61c" }}>
              <div>
                {/* <Link to={""} className="text-black">
                  <div className="my-1">
                    <i className="fa fa-plus" title=""></i> In / Out Time
                  </div>
                </Link> */}
                <Link
                  to={`${env}/TaskDashboard/TaskAssignment?type=adhoc`}
                  className="text-black">
                  <div className="my-1">
                    <i className="fa fa-plus" title=""></i> New Task
                  </div>
                </Link>
                <Link
                  to={`${env}/TicketDashboard/TicketAssignment?type=adhoc`}
                  className="text-black">
                  <div className="my-1">
                    <i className="fa fa-plus" title=""></i> New Ticket
                  </div>
                </Link>
                <Link
                  to={`${env}/master/leaveRequest/edit`}
                  className="text-black">
                  <div className="my-1">
                    <i className="fa fa-plus" title=""></i> Request / Leave
                    Absence
                  </div>
                </Link>
              </div>
            </Popover.Body>
          </Popover>
        }>
        <a className="float" onClick={(e) => e.preventDefault()}>
          <i className="fa fa-plus my-float"></i>
        </a>
      </OverlayTrigger>
    </>
  );
};

export default Bubble;
