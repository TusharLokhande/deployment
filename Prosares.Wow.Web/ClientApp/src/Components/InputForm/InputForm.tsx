import React from "react";
import { Form } from "react-bootstrap";

const InputForm = ({
  value,
  placeholder,
  isDisabled,
  textArea,
  onChange,
  ...rest
}) => {
  return (
    <>
      {textArea ?
        <Form.Control
          placeholder={placeholder}
          value={value}
          disabled={isDisabled}
          as="textarea" rows={1}
          onChange={onChange}
          {...rest}
        /> :
        <Form.Control
          placeholder={placeholder}
          value={value}
          disabled={isDisabled}
          onChange={onChange}
          {...rest}
        />}
    </>
  );
};

export default InputForm;
