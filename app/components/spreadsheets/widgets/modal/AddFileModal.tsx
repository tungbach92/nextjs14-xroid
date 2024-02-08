import {BaseModal, BaseModalProps} from "@/app/components/base";
import {TitleSheets} from "@/app/components/spreadsheets";
import {Button, Checkbox, FormControlLabel, TextField} from "@mui/material";
import React from "react";
import {Cached} from "@mui/icons-material";

interface Props extends BaseModalProps {
  title?: string
}

const dataSheets = [
  "シート1",
  "シート2",
  "シート3",
  "シート4",
  "シート5",
  "シート6",
  "シート7",
  "シート8",
  "シート9"
]

export const AddFileModal: React.FC<Props> = ({title, isOpen, handleClose}) => {
  const handleAddSheet = () => {
    if (handleClose) handleClose();
  }

  return (
    <BaseModal className="bg-white rounded-lg p-4 flex flex-col min-w-[300px]" isOpen={isOpen}
               handleClose={handleClose}>
      <div className={"text-center border-0 border-b border-solid border-gray-300 pb-3 mb-3"}>スプレッドシート追加</div>
      <div className="import-name-file mb-3 flex gap-2">
        <TextField
          placeholder={"エネビーストデータ"}
          size={"small"}
          className={"w-full border-solid border-1 border-lightGreen"}
          inputProps={{
            style: {
              paddingTop: 5,
              paddingBottom: 4
            }
          }}
        />
        <Button size={"small"} className={"bg-lightGreen min-w-0 rounded text-white px-2"}>
          <Cached fontSize={"small"} />
        </Button>
      </div>
      <TitleSheets title={"エネビーストデータ"} size={"base"} sizeTablet={"base"} className={"text-md"}/>
      <div className={"mt-3 mb-3"}>全てのシート</div>
      <div className={" max-h-32 overflow-auto"}>
        <div className={"pl-3 sheetList flex flex-col"}>
          {dataSheets.map(item => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  name={item}
                  size={"small"}
                  className={"p-2"}
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label={item}
            />
          ))}
        </div>
      </div>
      <div className="action flex justify-end items-center">
        <Button onClick={handleClose}
                className="justify-start px-3 flex text-lightGreen duration-300 hover:text-lightGreenHover text-center">
          キャンセル
        </Button>
        <Button onClick={handleAddSheet}
                className="justify-center px-3 flex bg-lightGreen duration-300 hover:text-white hover:bg-lightGreenHover text-center text-white">
          同意
        </Button>
      </div>
    </BaseModal>
  );
};
