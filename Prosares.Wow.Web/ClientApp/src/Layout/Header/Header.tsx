import React from "react";
import { getContext } from "../../Helpers/Context/Context";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

function Header(props) {
  const context = getContext();
  const deleteCookie = (name) => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  const popover = (
    <Popover>
      <Popover.Header>{context.UserName}</Popover.Header>
      <Popover.Body>
        <a
          style={{
            textDecoration: "none",
          }}
          onClick={() => {
            return true;
          }}
          rel="noopener noreferrer"
          href={`${window.location.origin}/ChangePassword?id=${context.EmployeeId}`}>
          Change Password
        </a>
        <hr />
        <a
          style={{
            textDecoration: "none",
          }}
          onClick={() => {
            deleteCookie("ApplicationToken");
            return true;
          }}
          rel="noopener noreferrer"
          href={window.location.origin}>
          Logout
        </a>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <header id="header">
        <div className="headerbar">
          <div
            className="headerbar-left left-logo"
            style={{ marginRight: "50px" }}>
            <ul className="header-nav header-nav-options">
              <li className="sandwich-menu">
                <a
                  className="btn btn-icon-toggle btn-default menubar-toggle"
                  data-toggle="menubar"
                  onClick={(e) => {
                    e.preventDefault();
                    props.menuOpenFunc();
                  }}>
                  <i className="fas fa-bars"></i>
                </a>
              </li>
              <li className="header-nav-brand">
                <div className="brand-holder">
                  <a
                    className="navbar-brand mt-1 mr-1 logo-left"
                    href=""
                    onClick={(e) => e.preventDefault()}>
                    <img
                      src={`${process.env.REACT_APP_PUBLISH_PATH}/img/prosares_logo-1.png`}
                      alt=""
                    />
                    {/* <img src="img/prosares_logo-1.png" alt="" /> */}
                  </a>
                  <a
                    className="navbar-brand logo-left"
                    href=""
                    onClick={(e) => e.preventDefault()}>
                    <img
                      src={`${process.env.REACT_APP_PUBLISH_PATH}/img/wow.svg`}
                      style={{
                        width: "185px",
                        height: "42px",
                        marginLeft: "-45px",
                      }}
                      alt=""
                    />

                    {/* <img src="img/wow.svg" alt="" width="80" /> */}
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <div className="headerbar-right" style={{ marginLeft: "200px" }}>
            <ul className="header-nav header-nav-options header-nav-profile">
              {/* <li>
                <a>
                  <i style={{ color: "white" }} className="fa fa-search"></i>
                </a>
              </li> */}
              {/* <li className="notification dropdown">
                <div
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  style={{ marginTop: "5px" }}>
                  <a>
                    <i className="fa fa-bell" aria-hidden="true"></i>
                    <span className="notify">3</span>
                  </a>
                </div>
                <ul className="dropdown-menu p-1">
                  <div className="notification-panel card">
                    <div className="card-body">
                      <p className="notification_title">Notifications</p>
                      <div className="card-noti">
                        Expense report for trip
                        <a>PU9M</a>
                        mumbai-Zurich-Mumbai is due.
                      </div>
                      <div className="card-noti">
                        Bhavesh Panchal (HOD) has raised query re trip
                        <a>JB31</a>
                        Mumbai-Hyderabad-Mumbai
                      </div>
                    </div>
                  </div>
                </ul>
              </li> */}

              <li>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={popover}
                  rootClose>
                  <div
                    className="user-profile dropdown"
                    style={{ cursor: "pointer" }}>
                    <div className="dropdown-toggle" data-toggle="dropdown">
                      <a>
                        <span
                          style={{ color: "white" }}
                          className="role-icon fas fa-user"
                          data-toggle="tooltip"
                          title="Profile"></span>
                        <span className="welcome desktop"></span>
                      </a>
                    </div>

                    {/* <ul className="dropdown-menu p-1"> */}
                    {/* <li className="welcome mobile">
                      <a href="#">
                        <span className="">Suresh Jindal</span>
                      </a>
                    </li> */}
                    {/* <li className="dropdown-header">
                        {context.UserName}
                        <ul className="ml-1">
                          <li className="dropdown-item">
                            <a
                              style={{
                                fontSize: "0.9rem",
                                textDecoration: "none",
                              }}
                              onClick={() => {
                                return true;
                              }}
                              rel="noopener noreferrer"
                              href={
                                "http://192.168.0.61:8082/" ||
                                "https://localhost:5001"
                              }>
                              Logout
                            </a>
                          </li>
                        </ul>
                      </li> */}
                    {/* <div className="dropdown-divider"></div>
                    <li className="dropdown-header">
                      Login As
                      <ul className="ml-1">
                        <li className="dropdown-item">Sandeep Yalgi</li>
                      </ul>
                    </li> */}
                    {/* </ul> */}
                  </div>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
