import React from "react";

const Heading = ({ title }) => {
  return (
    <section className="bg_breadcrumb">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <h4>{title}</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heading;
