import {BaseModal, BaseModalProps} from "@/app/components/base";
import {ModalSpreadSheetsLayout} from "../modal/layout";
import {CardSheet, SelectRow, TitleSheets} from "@/app/components/spreadsheets";
import React, {useEffect, useState} from "react";
import {IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import dataSetModal from "@/app/components/spreadsheets/json/data-set-modal.json";

interface Props extends BaseModalProps {
  title?: string
}

interface DataSetItemProps {
  item: any
}

export const AddDataSetModal: React.FC<Props> = ({isOpen, handleClose}) => {
  return (
    <BaseModal className="bg-white rounded-lg p-0 flex flex-col min-w-[1200px]" isOpen={isOpen}
               handleClose={handleClose}>
      <ModalSpreadSheetsLayout titleButton={"Data Set +"}>
        <div className={"p-8"}>
          <div className={"title font-bold mb-4"}>
            既存ファイル
          </div>
          <div className="content">
            {dataSetModal.map(dataSetItem => (
              <div key={dataSetItem.id} className={"flex gap-4"}>
                <TitleSheets title={dataSetItem.name || ""} icon={"struct"} size={"base"} sizeTablet={"base"}
                             className={"text-md whitespace-nowrap"}/>
                <div className=" flex gap-2 w-full">
                  {dataSetItem.data.map(item => (
                    <DataSetItem item={item} key={item.id + "" + dataSetItem.id} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalSpreadSheetsLayout>
    </BaseModal>
  );
};

const DataSetItem = ({item}: DataSetItemProps) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    if(!item?.value) return;
    setValue(item.value);
  }, [item.value]);

  const handleChange = (e) => {
    console.log(e);
    setValue(e.target.value.toString())
  }

  return (
    <CardSheet className={"w-full px-2 py-0 bg-[#F5F7FB] border-0 pb-2 mt-2"}>
      <div className="top flex justify-between items-center">
        <div className="title text-xs">
          {item.name}
        </div>
        <IconButton size={"small"} className={"-mr-2"}>
          <Close/>
        </IconButton>
      </div>
      <div className={"flex items-center"}>
        <SelectRow value={value} onChange={handleChange} className={"w-20 mr-4 bg-[#E1E9F2] border-0"}/>
      </div>
    </CardSheet>
  )
}
