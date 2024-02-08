import React from "react";
import {CardSheet, TitleSheets} from "@/app/components/spreadsheets";
import {Button, TextField} from "@mui/material";

interface Props {
  item: any
}

export const SheetFile = ({item}: Props) => {
  return (
    <CardSheet key={item.id} className={"w-[345px]"}>
      <div className={"flex items-center justify-between"}>
        <TitleSheets title={item.title} size={"xl"} sizeTablet={"[20px]"}/>
        <Button variant={"contained"} size={'small'} className={"bg-[#ADADAD] hover:bg-[#9d9d9d]"}>読み込み</Button>
      </div>
      <div className={"date text-xs text-gray-400 leading-6"}>
        {item.date}
      </div>
      <TextField
        hiddenLabel
        variant="outlined"
        placeholder={"出力テキスト"}
        size={"small"}
        className={"w-full mt-3"}
      />
      <div className={"text-base mt-3"}>
        読み込んだシート
      </div>
      <div className="sheets-list flex justify-between items-center mt-3">
        <div className="list flex flex-wrap items-start text-gray-500 gap-4">
          {item.sheetList.map((item, index) => (
            <div key={index + "sheetList"}>{item.name}</div>
          ))}
        </div>
        <Button variant={"contained"} className={"bg-lightGreen hover:bg-lightGreenHover whitespace-nowrap"}>Sheet
          +</Button>
      </div>
    </CardSheet>
  )
}
