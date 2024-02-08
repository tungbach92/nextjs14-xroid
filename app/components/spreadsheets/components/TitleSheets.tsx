import React from "react";
import {imageUri} from "@/app/components/assets";
import {IconExcel} from "@/app/components/spreadsheets/components/index";

type Props = {
  iconStruct?: boolean,
  icon?: "excel" | "excelStruct" | "struct"
  title: string,
  addSheet?: boolean,
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | string
  sizeTablet?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | string
  className?: string
}

export const TitleSheets = ({iconStruct, icon, title, addSheet, className, size, sizeTablet}: Props) => {
  let classTxt = "flex space-x-2 flex-row tablet:space-x-4 items-center ";
  if (className !== "") classTxt += className;
  return (
    <>
      <div className={classTxt}>
        {icon === "excelStruct" ? (
          <IconExcel className="hidden tablet:flex"/>
        ) : icon === "struct" ? (
          <img src={imageUri.iconImg.iconStructures} className="w-6 h-6" />
        ) : (
          <img src={imageUri.iconImg.spreadsheetsIcon} className="hidden tablet:flex w-6 h-6"/>
        )}
        <h1 className={`text-${size ? size : "base"} tablet:text-${sizeTablet ? sizeTablet : "2xl"} mt-0 mb-0`}>{title}</h1>
        {addSheet && (
          <div className="bg-lightGreen hover:bg-lightGreenHover group duration-300 m-0 rounded-lg shadow-lg px-3">
            <h1 className="cursor-pointer text-2xl font-light group-hover:text-white duration-300 m-0 pb-1 p-0 text-center text-black">
              +
            </h1>
          </div>
        )}
      </div>
    </>
  )
}
