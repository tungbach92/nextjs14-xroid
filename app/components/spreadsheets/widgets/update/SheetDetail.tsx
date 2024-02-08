import React, {useEffect, useState} from "react";
import {CardSheet, SelectRow, TitleSheets} from "@/app/components/spreadsheets";
import {Button, TextField} from "@mui/material";

interface Props {
  sheet: any
}

interface PropsCellItem {
  item: any
}

export const SheetDetail = ({sheet}: Props) => {
  return (
    <CardSheet className={"w-[345px] border-[#4CAF50] px-8"}>
      <TitleSheets title={sheet.title} size={"xl"} sizeTablet={"[20px]"} className={"justify-center"}/>
      {sheet.sheetList && sheet.sheetList.map((sheetItem) => (
        <div key={sheetItem.id + "sheetList2"}
             className={"border-solid border-0 border-b border-gray-300 last:border-b-0 py-4"}>
          <div className={"flex justify-center items-center gap-4"}>
            <div>{sheetItem.name}</div>
            <Button
              variant={"contained"}
              className={"bg-lightGreen hover:bg-lightGreenHover whitespace-nowrap"}
            >
              Cell +
            </Button>
          </div>
          <div className="cell-list">
            {sheetItem?.cellsList && sheetItem?.cellsList.map(cellItem => (
              <CellItem key={cellItem.id + "cellsList"} item={cellItem} />
            ))}
          </div>
        </div>
      ))}
    </CardSheet>
  )
}

const CellItem = ({item}: PropsCellItem) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if(!item?.position?.y) return;
    setValue(item.position.y)
  }, [item?.position?.y]);

  const handleChange = (e) => {
    setValue(e.target.value.toString())
  }


  return (
    <CardSheet key={item.id}
               className={"border-lightGreen bg-lightGreen mt-3 flex flex-col gap-2"}>
      <div className="flex gap-2 justify-center items-center">
        <div className={"text-white text-right w-20"}>
          名前
        </div>
        <div className={'w-full'}>
          <TextField
            value={item.name}
            hiddenLabel
            variant="outlined"
            placeholder={"出力テキスト"}
            size={"small"}
            className={"w-full text-center outline-0 border-solid border-gray-100 rounded text-gray bg-white"}
            inputProps={{
              style: {
                height: "30px",
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <div className={"text-white text-right w-20"}>
          値
        </div>
        <div className={'w-full flex gap-2'}>
          <TextField
            value={item.position.x}
            hiddenLabel
            variant="outlined"
            placeholder={"出力テキスト"}
            size={"small"}
            className={"w-full text-center outline-0 border-solid border-gray-100 rounded text-gray bg-white"}
            inputProps={{
              style: {
                height: "30px",
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
          />
          <SelectRow value={value} onChange={handleChange}/>
        </div>
      </div>
    </CardSheet>
  )
}
