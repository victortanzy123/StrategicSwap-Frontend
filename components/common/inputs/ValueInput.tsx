"use client";
import { DEFAULT_CHAIN_DETAILS } from "@/utils/helpers/web3";
import React, { Dispatch, memo, SetStateAction } from "react";

type ValueInputProps = {
  onChangeHandler: Dispatch<SetStateAction<number>>;
  placeholder?: string;
  units?: string;
  className?: string;
};

function ValueInput({
  onChangeHandler,
  placeholder = "",
  units = DEFAULT_CHAIN_DETAILS.currencyCode,
  className = "",
}: ValueInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChangeHandler(() => parseFloat(e.target.value));
  }
  return (
    <div>
      {" "}
      <input
        className={`border-2 border-gray h-12 rounded-md p-4 text-xl ${className}`}
        placeholder={placeholder}
        onChange={handleChange}
      />
      {units ? (
        <span className="font-display text-2xl mr-4 -mt-10 ">{units}</span>
      ) : (
        <></>
      )}
    </div>
  );
}

export default memo(ValueInput);
