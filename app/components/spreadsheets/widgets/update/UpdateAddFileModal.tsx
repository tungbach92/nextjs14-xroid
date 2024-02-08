import {BaseModal, BaseModalProps} from "@/app/components/base";
import {ModalSpreadSheetsLayout} from "../modal/layout";
import {CardSheet, SelectRow} from "@/app/components/spreadsheets";
import React, {useEffect, useState} from "react";
import {Button, Checkbox, Divider, FormControlLabel, FormGroup, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import excelFolder from "@/app/components/spreadsheets/json/excel-folders.json";
import {imageUri} from "@/app/components/assets";

interface Props extends BaseModalProps {
  title?: string
}

interface DataSetItemProps {
  item: any
}

export const UpdateAddFileModal: React.FC<Props> = ({isOpen, handleClose}) => {
  return (
    <BaseModal className="bg-white rounded-lg p-0 flex flex-col min-w-[1200px]" isOpen={isOpen}
               handleClose={handleClose}>
      <ModalSpreadSheetsLayout titleButton={"New File +"} className={"bg-lightGreen hover:bg-lightGreenHover text-white"}>
        <div className={"p-8"}>
          <div className={"title font-bold mb-4"}>
            既存ファイル
          </div>
          <div className="content">
            {excelFolder.map(item => (
              <div key={item.id} className={"flex gap-4"}>
                <div key={item.id} className="flex space-x-8 flex-col tablet:flex-row">
                  <div>
                    <div className=" flex tablet:flex-row items-center mb-3 tablet:mb-0">
                      <div className="flex  items-center space-x-3 flex-col tablet:flex-row">
                        <div className="flex  items-center space-x-3">
                          <img src={imageUri.iconImg.spreadsheetsIcon} className="scale-75 tablet:scale-100 w-6 h-6" />
                          <p>{item.name}</p>
                        </div>
                        <div className="laptop:pl-16  laptop:flex-row  flex-col space-x-4 flex">
                          <FormGroup className="flex laptop:flex-row  flex-col">
                            {item?.fileList && item.fileList.map(it => (
                              <FormControlLabel
                                key={it.id + "" + item.id}
                                control={
                                  <Checkbox
                                    // checked={gilad}
                                    // onChange={handleChange}
                                    name="gilad"
                                    sx={{
                                      color: "green",
                                      "&.Mui-checked": {
                                        color: "green",
                                      },
                                    }}
                                  />
                                }
                                label={it.title}
                              />
                            ))}
                          </FormGroup>
                          <Button className="shadow-lg justify-start px-3 flex bg-lightGreen duration-300 hover:text-white hover:bg-lightGreenHover text-center text-white">
                            Sheet
                            <p className="p-0 m-0 text-xl ml-1">+</p>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Divider />
                  </div>
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
