import React, {useEffect, useState} from "react";
import {DataSet, LayoutSpreadSheets, SheetDetail, SheetFile} from "@/app/components/spreadsheets";
import {TitleSheets} from "@/app/components/spreadsheets/components";
import {Button} from "@mui/material";
import exelFolders from "@/app/components/spreadsheets/json/excel-folders.json";
import dataSet from "@/app/components/spreadsheets/json/data-set.json";
import {useRouter} from "next/navigation";
import {UpdateAddFileModal} from "@/app/components/spreadsheets/widgets/update/UpdateAddFileModal";
import useFolders from "@/app/hooks/useFolders";


const SpreadsheetUpdate = () => {
  const router = useRouter();
  useFolders();
  const {id} = router.query;
  const [sheetFolder, setSheetFolder] = useState<any>({});
  const [sheetFile, setSheetFile] = useState<any>({});
  const [isOpenAddFile, setIsOpenAddFile] = useState(false);

  useEffect(() => {
    if (typeof id !== "string") return
    const folder = exelFolders.find(item => item.id === id)
    if (folder) {
      setSheetFolder(folder)
      if (folder.fileList) {
        setSheetFile(folder.fileList[0])
      }
    }
  }, [id]);

  const handleAddFile = () => {
    setIsOpenAddFile(true)
  }

  if (!sheetFolder || !sheetFolder.id) return;

  return (
    <LayoutSpreadSheets>
      <TitleSheets title={sheetFolder.name} iconStruct={true} size={"base"} sizeTablet={"2xl"} className={"mb-6"}/>
      <div className="content-top flex items-start w-full gap-6">
        {sheetFolder?.fileList && sheetFolder?.fileList.map((item) => (
          <SheetFile item={item} key={item.id + "sheetFolder"}/>
        ))}
        <Button
          variant={"contained"}
          onClick={handleAddFile}
          className={"bg-lightGreen hover:bg-lightGreenHover whitespace-nowrap"}>
          New File +
        </Button>
      </div>
      <div className="mt-6 gap-6">
        {sheetFile && sheetFile?.id && (
          <div className={"content-main flex items-start w-full gap-6"}>
            <SheetDetail sheet={sheetFile} />
            <DataSet dataSet={dataSet} />
          </div>
        )}
      </div>
      <UpdateAddFileModal isOpen={isOpenAddFile} handleClose={() => setIsOpenAddFile(false)} />
    </LayoutSpreadSheets>
  )
}

export default SpreadsheetUpdate;
