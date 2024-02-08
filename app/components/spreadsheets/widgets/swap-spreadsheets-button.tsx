import { ToggleButtonBase, ToggleButtonProps } from "@/app/components/base";
import React, { Dispatch, SetStateAction } from "react";
import { configSwapSpreadsheetsButton } from "../configs";

interface SwapSpreadsheetsButtonProps extends ToggleButtonProps {
  setAlignment: Dispatch<SetStateAction<string>>;
}

export const SwapSpreadsheetsButton: React.FC<SwapSpreadsheetsButtonProps> = ({ setAlignment, alignment }) => {
  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    if (!newAlignment) return;
    setAlignment(newAlignment);
  };
  return (
    <div className="scale-75 shadow-lg laptop:scale-100 ">
      <ToggleButtonBase
        onChange={handleAlignment}
        alignment={alignment}
        configToggleButton={configSwapSpreadsheetsButton}
        className={` text-black font-bold `}
      />
    </div>
  );
};
