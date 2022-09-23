import React from "react";

import { components } from "react-select";

import Select from "react-select";

import AsyncSelect from "react-select/async";

// color style func for react select
// color style func for react select
const reactSelectTheme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: "dimgrey",
  },
});

// height of react select
const reactSelectStyle = {
  control: (base) => ({
    ...base,
    height: 34,
    minHeight: 34,
    // marginBottom: 5,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingTop: 2,
    paddingBottom: 2,
  }),
  input: (base) => ({
    ...base,
    height: 34,
    minHeight: 34,
    paddingTop: 2,
    paddingBottom: 2,
    margin: -5,
  }),
  clearIndicator: (base) => ({
    ...base,
    paddingTop: 2,
    paddingBottom: 2,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

// N items selected custom
const ValueContainer = ({ children, ...props }: any) => {
  let [values, input] = children;
  if (Array.isArray(values)) {
    if (values.length === 1) {
      values = values[0].props.data.label;
    } else {
      const plural = values.length === 1 ? "" : "s";
      values = `${values.length} item${plural} selected`;
    }
  }
  return (
    <components.ValueContainer {...props}>
      {values}
      {input}
    </components.ValueContainer>
  );
};

const SelectForm = ({
  id = "",
  label = "",
  value,
  placeholder,
  options,
  isMulti = false,
  isSearchable = true,
  isClearable = false,
  async = false,
  maxWidth = "20",
  noIndicator = true,
  noSeparator = true,
  hideSelectedOptions = false,
  isDisabled = false,
  defaultValue = [] || {},
  cacheOptions = false,
  ...rest
}) => {
  return (
    <>
      {async ? (
        <AsyncSelect
          placeholder={placeholder}
          isMulti={isMulti}
          value={value}
          menuPortalTarget={document.body}
          theme={reactSelectTheme}
          loadOptions={options}
          styles={reactSelectStyle}
          components={
            noIndicator
              ? {
                  ValueContainer,
                  DropdownIndicator: null,
                }
              : noSeparator
              ? { ValueContainer, IndicatorSeparator: null }
              : { ValueContainer }
          }
          isSearchable={isSearchable}
          isDisabled={isDisabled}
          cacheOptions={cacheOptions}
          maxMenuHeight={200}
          isClearable={isClearable}
          closeMenuOnSelect={isMulti ? false : true}
          hideSelectedOptions={hideSelectedOptions}
          defaultValue={defaultValue}
          {...rest}
        />
      ) : (
        <Select
          options={options}
          isMulti={isMulti}
          placeholder={placeholder}
          value={value}
          menuPortalTarget={document.body}
          theme={reactSelectTheme}
          styles={reactSelectStyle}
          components={
            noIndicator
              ? {
                  ValueContainer,
                  DropdownIndicator: null,
                }
              : noSeparator
              ? { ValueContainer, IndicatorSeparator: null }
              : { ValueContainer }
          }
          isSearchable={isSearchable}
          isDisabled={isDisabled}
          maxMenuHeight={200}
          isClearable={isClearable}
          closeMenuOnSelect={isMulti ? false : true}
          hideSelectedOptions={hideSelectedOptions}
          defaultValue={defaultValue}
          {...rest}
        />
      )}
    </>
  );
};

export default SelectForm;
