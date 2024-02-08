import { imageUri } from "@/app/components/assets";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

interface IconExcelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const IconExcel: React.FC<IconExcelProps> = ({ ...props }) => {
  return (
    <div className={` flex space-x-2 items-center flex-wrap ${props.className}`}>
      <img src={imageUri.iconImg.spreadsheetsIcon} />
      <h1>-</h1>
      <img src={imageUri.iconImg.iconStructures} className="w-6 h-6" />
    </div>
  );
};
