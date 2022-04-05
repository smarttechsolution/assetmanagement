import React, { CSSProperties, useRef } from "react";
import PropTypes from "prop-types";
import { components, ValueType, InputActionMeta } from "react-select";
import { convertEngToNepNumber, getTextByLanguage } from "i18n/i18n";
import Select from "react-select/creatable";

/**
 * custom select styles
 */
const selectStyles: Partial<any> = {
  control: (_provided: CSSProperties, state: any) => { 
    return {
      background: state.selectProps.searchModule
        ? "#052354"
        : state["isDisabled"]
        ? "#e2e2e2"
        : "#fff",
      color: "#b3b8bd",
      display: "flex",
      width: "100%",
      height: state.isMulti ? "36px" : "auto",
      padding: state.isMulti ?  "0.12rem 0.8rem": "0.42rem 0.8rem",
      fontSize: "0.833rem",
      fontWeight: 400,
      lineHeight: "1.25",
      zIndex: 1200,
      verticalAlign: "middle",
      outline: "none",
      border:
        state.isFocused ||
        (!state["isDisabled"] &&
          state["selectProps"] &&
          state["selectProps"].touched &&
          !state["hasValue"])
          ? "1px solid rgba(158, 160, 160, 0.5)"
          : "1px solid rgba(158, 160, 160, 0.5)",
      boxShadow: "none",
      borderRadius: "5px",
      appearance: "none",
      // borderBottom:
      //   state.isFocused ||
      //   (!state["isDisabled"] &&
      //     state["selectProps"] &&
      //     state["selectProps"].touched &&
      //     !state["hasValue"])
      //     ? "2px solid rgb(78, 90, 97)"
      //     : "2px solid #E9E9F0",

      ...state.selectProps.customStyles,
    };
  },
  dropdownIndicator: (provided: CSSProperties, state: any) => ({
    ...provided,
    display: state && state.options?.length < 1 ? "none" : "block",
    // padding: "10px 6px",
  }),
  indicatorsContainer: (provided: CSSProperties, state: any) => ({
    ...provided,
    position: "absolute",
    right: 0,
    bottom: 0,

    // bottom: 5,
  }),
  indicatorSeparator: (provided: CSSProperties) => ({
    ...provided,
    display: "none",
  }),
  clearIndicator: (provided: CSSProperties) => ({
    ...provided,
    padding: "8px 0",
    width: "14px",
  }),
  loadingIndicator: (provided: CSSProperties) => ({
    ...provided,
    color: "#000000",
    padding: "8px 4px",
    marginRight: 0,
  }),
  loadingMessage: (provided: CSSProperties) => ({
    ...provided,
    paddingTop: "4px",
    paddingBottom: "4px",
    fontSize: "0.833rem",
  }),
  menu: (provided: CSSProperties, state: any) => ({
    ...provided,
    // marginTop: 0,
    // marginBottom: 0,
    zIndex: 1200,
    backgroundColor: state.selectProps.searchModule ? "#052354" : provided.backgroundColor,
  }),
  menuList: (provided: CSSProperties, state: any) => ({
    ...provided,
    backgroundColor: state.selectProps.searchModule ? "#052354" : provided.backgroundColor,
  }),
  noOptionsMessage: (provided: CSSProperties, state: any) => ({
    ...provided,
    paddingTop: "4px",
    paddingBottom: "4px",
    fontSize: "0.833rem",
    color: state.selectProps.searchModule ? "#ACD4FF" : provided.color,
    backgroundColor: state.selectProps.searchModule && "#0da3b8",
  }),
  option: (provided: CSSProperties, { data, isSelected, selectProps, isFocused }: any) => {
    return {
      ...provided,
      backgroundColor:
        selectProps.searchModule && isSelected
          ? "#0da3b8"
          : selectProps.searchModule && isFocused
          ? "#0da3b8"
          : isSelected
          ? "#98c1ff"
          : provided.backgroundColor,
      color: selectProps.searchModule ? "#ACD4FF" : data.color ? data.color : provided.color,
      fontWeight: data.color ? 800 : provided.fontWeight,
      cursor: "pointer",
      paddingTop: "4px",
      paddingBottom: "4px",
      fontSize: "0.833rem",
      "&:hover": { backgroundColor: selectProps.searchModule && "#0da3b8" },
    };
  },
  placeholder: (provided: CSSProperties, state: any) => ({
    ...provided,
    color: state.selectProps.searchModule ? "#ACD4FF" : "#666666",
    // padding: 0,
    // position: "absolute",
    // top: "75%",
  }),
  input: (provided: CSSProperties, state: any) => {
    return {
      // position: "absolute",
      // top: "55%",
    };
  },
  singleValue: (provided: CSSProperties, { getValue, selectProps }: any) => ({
    ...provided,
    lineHeight: 2,
    color: selectProps.searchModule
      ? "#b3b8bd"
      : getValue().length && getValue()[0].color
      ? getValue()[0].color
      : "#b3b8bd",
    fontWeight: getValue().length && getValue()[0].color ? 800 : provided.fontWeight,
    top: "70%",
  }),
  multiValue: (provided: CSSProperties, { getValue, selectProps }: any) => ({
    ...provided,
    top: "70%",
  }),
  valueContainer: (provided: CSSProperties, state: any) => ({
    ...provided,
    paddingLeft: 0,
    paddingRight: 0,
    color: state.selectProps.searchModule ? "#ACD4FF" : "#666666",
  }),
};

/**
 * Dropdown indicator element
 */
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={8}
        height={8}
        viewBox="0 0 255 255"
        style={{ color: "#6c757d", fontSize: "8px" }}
      >
        <path d="M0 63.75l127.5 127.5L255 63.75z" />
      </svg>
    </components.DropdownIndicator>
  );
};

/**
 * Checkbox Option Container
 */
const CheckboxOption = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={props.isSelected}
            onChange={() => null}
          />
          <label className="form-check-label" style={{ cursor: "pointer" }}>
            {props.label}
          </label>
        </div>
      </components.Option>
    </div>
  );
};

/**
 * Checkbox All Select Option
 */
const allOption = {
  label: getTextByLanguage("Select all", "सबै चयन गर्नुहोस्"),
  value: "*",
};

/**
 * Checkbox Option Container
 */
const ValueContainer = (props) => {
  const currentValues = props.getValue();
  let selectedCount = currentValues.length;

  if (currentValues.some((val) => val.value === allOption.value)) {
    selectedCount = currentValues.length - 1;
  }

  return (
    <components.ValueContainer {...props}>
      {selectedCount
        ? getTextByLanguage(
            `${selectedCount} selected`,
            `${convertEngToNepNumber(selectedCount)} चयनित`
          )
        : getTextByLanguage("Choose Option...", "विकल्प छान्नुहोस ...")}
    </components.ValueContainer>
  );
};

interface OnMultiCheckboxSelectProps {
  selected: ValueType<OptionType, IsMulti>;
  action: string;
  onMultiChange: (event: ValueType<OptionType, IsMulti>) => void;
  options: OptionType[];
}
/**
 * On Multiple Checkbox Select
 */
const onMultiCheckboxSelect = ({
  selected,
  action,
  onMultiChange,
  options,
}: OnMultiCheckboxSelectProps) => {
  if (selected !== null && selected instanceof Array && selected.length > 0) {
    if (selected[selected.length - 1].value === allOption.value) {
      return onMultiChange([allOption, ...options]);
    }
    let result: OptionType[] = [];
    if (selected.length === options.length) {
      if (selected.includes(allOption)) {
        result = selected.filter((option) => option.value !== allOption.value);
      } else if (action === "select-option") {
        result = [allOption, ...options];
      }
      return onMultiChange(result);
    }

    return onMultiChange(selected);
  } else {
    return onMultiChange([]);
  }
};

/**
 * Generic dropdown component
 */
export interface OptionType {
  label: string;
  value: any;
}
export type IsMulti = boolean;
interface OnChangeType {
  name: string;
  value: ValueType<OptionType, IsMulti>;
}
interface OnInputType {
  newValue: string;
  actionMeta?: InputActionMeta;
}

interface Props {
  touched?: boolean;
  onBlur?: (name: string, active: boolean) => any;
  placeholder?: string;
  id?: string;
  name: string;
  isSearchable?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  options: OptionType[];
  onChange: ({ name, value }: OnChangeType) => void;
  onInputChange?: ({ newValue, actionMeta }: OnInputType) => void;
  value: ValueType<OptionType, IsMulti>;
  multi?: IsMulti;
  multiCheckbox?: IsMulti;
  autoFocus?: boolean | undefined;
  className?: string;
  searchModule?: boolean;
  filterModule?: boolean;
  customStyles?: CSSProperties;
  userCustomOption?: boolean;
  onCreateOption?: any;
}
function StyledSelect(props: Props) {
  const {
    touched,
    onBlur,
    placeholder,
    id,
    name,
    isSearchable,
    isLoading,
    isDisabled,
    options,
    onChange,
    onInputChange,
    value,
    multi,
    multiCheckbox,
    autoFocus,
    className,
    searchModule,
    filterModule,
    customStyles,
    onCreateOption,
  } = props;
  const imageDivRef = useRef([]);
  return (
    <Select
      isMulti={multi || multiCheckbox}
      closeMenuOnSelect={!multiCheckbox}
      hideSelectedOptions={!multiCheckbox}
      placeholder={placeholder}
      id={id}
      name={name}
      onBlur={() => onBlur && onBlur(name, true)}
      onChange={(selected, actionMeta) => {
        // MultiSelect
        if (multiCheckbox) {
          onMultiCheckboxSelect({
            selected,
            action: actionMeta.action,
            onMultiChange: (selected) => onChange({ name, value: selected }),
            options,
          });
        } else {
          onChange({ name, value: selected });
        }
      }}
      searchModule={searchModule}
      filterModule={filterModule}
      onInputChange={(value, actionMeta) => {
        onInputChange && onInputChange({ newValue: value, actionMeta });
      }}
      value={value || null}
      touched={touched}
      options={multiCheckbox ? [allOption, ...options] : options}
      autoFocus={autoFocus}
      isSearchable={isSearchable}
      isLoading={isLoading}
      isDisabled={isDisabled}
      loadingMessage={() => "Fetching Data..."}
      components={
        !multiCheckbox
          ? { DropdownIndicator }
          : { Option: CheckboxOption, ValueContainer, DropdownIndicator }
      }
      styles={selectStyles}
      menuPlacement="auto"
      className={className}
      autoComplete="off"
      customStyles={customStyles || {}}
      imageDivRef={imageDivRef}
      isClearable={true}
      noOptionsMessage={() => null}
      onCreateOption={onCreateOption || null}
    />
  );
}

StyledSelect.propTypes = {
  /** touched if select is dirty */
  touched: PropTypes.bool,
  /** on blur action */
  onBlur: PropTypes.func,
  /** select placeholder */
  placeholder: PropTypes.string,
  /** select id */
  id: PropTypes.string,
  /** select name for form */
  name: PropTypes.string,
  /** enable/disable search */
  isSearchable: PropTypes.bool,
  /** enable/disable data loading animation */
  isLoading: PropTypes.bool,
  /** enable/disable select */
  isDisabled: PropTypes.bool,
  /** options list */
  options: PropTypes.array.isRequired,
  /** on select change action */
  onChange: PropTypes.func,
  /** value for select */
  value: PropTypes.object || PropTypes.any,
  /** enable/disable multi select */
  multi: PropTypes.bool,
  /** enable/disable autofocus */
  autoFocus: PropTypes.bool,
  /** custom classname */
  className: PropTypes.string,
};

StyledSelect.defaultProps = {
  touched: false,
  isSearchable: true,
  isLoading: false,
  isDisabled: false,
  options: [],
  multi: false,
  autoFocus: false,
};

export default StyledSelect;
