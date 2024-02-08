import React, {useState} from "react";
import { Button, Divider } from "@mui/material";
import {IconExcel} from "../components";
import configsLinkExcelList from "../json/link-excel.json";
import {useRouter} from "next/navigation";
import {AddFileStructModal} from "@/app/components/spreadsheets/widgets/modal/AddFileStructModal";
import {Add} from "@mui/icons-material";

interface LinkSpreadsSheetsWidgetsProps {
  data: any
}

interface ItemProps {
  data?: any
}

interface Props {
  Item: React.FC<ItemProps>;
}

export const LinkSpreadsSheetsWidgets: React.FC<LinkSpreadsSheetsWidgetsProps> & Props = ({data}) => {
  const [isOpenAddFile, setIsOpenAddFile] = useState(false);

  const handleAddFiles = () => {
    setIsOpenAddFile(true)
  }
  return (
    <div className="flex flex-col space-y-2 flex-wrap ">
      <div className="flex space-x-2 flex-row tablet:space-x-6 items-center ">
        <IconExcel className="hidden tablet:flex" />
        <h1 className="text-lg tablet:text-2xl">スプレッドシート連携</h1>

        <Button onClick={handleAddFiles} className={"bg-lightGreen min-w-0 rounded-lg text-black hover:text-white"}>
          <Add />
        </Button>
      </div>
      <LinkSpreadsSheetsWidgets.Item data={data} />
      <AddFileStructModal isOpen={isOpenAddFile} handleClose={() => setIsOpenAddFile(false)} />
    </div>
  );
};

LinkSpreadsSheetsWidgets.Item = function Item({data}) {
  const router = useRouter();
  const handleClick = (i: string) => {
    router.push(`./spreadsheets/update/${i}`).then()
  }

  return (
    <div className="flex flex-col ">
      {data.map((item, i) => (
        <>
          <div key={i} className="flex space-x-20 flex-col tablet:flex-row items-center mb-3 tablet:mb-0">
            <div className="flex  items-center space-x-3">
              <IconExcel className="scale-75 tablet:scale-100" />
              <p>{item.name}</p>
            </div>
            <div className=" pl-10 flex">
              <Button onClick={() => handleClick(item.id)} className="justify-end px-3 flex shadow-lg bg-lightGreen duration-300 hover:text-white hover:bg-lightGreenHover text-center text-white">
                アップデート
              </Button>
            </div>
          </div>
          <Divider />
        </>
      ))}
    </div>
  );
};
