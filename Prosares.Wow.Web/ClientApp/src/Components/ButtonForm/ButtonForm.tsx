import React from "react";
import { Button } from "react-bootstrap";

const ButtonForm = ({
  id = "",
  value,
  disabled = false,
  ...rest
}) => {
  return (
    <Button  type="button" id={id} disabled={disabled} {...rest}>
      {value}
    </Button>
  );
};

export default ButtonForm;

