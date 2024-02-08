import React from 'react';

type Props = {
  type?: string,
  value?: any,
  onChange?: any,
  className?: any
  defaultValue?: string
  readOnly?: boolean
  disabled?: boolean
}

function InputCustom({type = "text", value, onChange, className, defaultValue, readOnly = false, disabled = false}: Props) {
  return (
    <input
      defaultValue={defaultValue}
      type={type}
      min={0}
      readOnly={readOnly}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${className} focus:outline-0 w-full border-0 rounded h-[35px] text-center font-medium text-sm ${disabled ? "!text-gray-300 bg-[#f8fbff]" : "!text-black bg-[#F5F7FB]" }`}/>
  );
}

export default InputCustom;
