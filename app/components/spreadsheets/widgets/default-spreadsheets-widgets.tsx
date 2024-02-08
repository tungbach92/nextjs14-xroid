import {Button, Checkbox, Divider, FormControlLabel, FormGroup} from "@mui/material";
import { imageUri } from "@/app/components/assets";
import React, { useState } from "react";
import {useRouter} from "next/navigation";
import {Add} from "@mui/icons-material";
import {AddSheetModal} from "@/app/components/spreadsheets/widgets/modal/AddSheetModal";
import {AddFileModal} from "@/app/components/spreadsheets/widgets/modal/AddFileModal";

interface DefaultSpreadsSheetsWidgetsProps {
  data: any
}

interface ItemProps {
  isHidden?: boolean;
  data?: any
}
interface Props {
  Item: React.FC<ItemProps>;
}

export const DefaultSpreadsSheetsWidgets: React.FC<DefaultSpreadsSheetsWidgetsProps> & Props = ({data}) => {
  const [isOpenAddFile, setIsOpenAddFile] = useState(false);

  const handleAddFiles = () => {
    setIsOpenAddFile(true)
  }

  return (
    <div className="flex flex-col space-y-2 flex-wrap ">
      <div className="flex space-x-2 flex-row tablet:space-x-6 items-center ">
        <img src={imageUri.iconImg.spreadsheetsIcon} className="hidden tablet:flex w-8 h-8" />
        <h1 className="text-lg tablet:text-2xl">スプレッドシート</h1>

        <Button onClick={handleAddFiles} className={"bg-lightGreen min-w-0 rounded-lg text-black hover:text-white"}>
          <Add />
        </Button>
      </div>
      {/* ui mẫu sau sẽ sửa lại đúng với logic */}
      {/*<DefaultSpreadsSheetsWidgets.Example isHidden={true} />*/}
      <DefaultSpreadsSheetsWidgets.Item isHidden={true} data={data} />
      <AddFileModal isOpen={isOpenAddFile} handleClose={() => setIsOpenAddFile(false)} />
    </div>
  );
};

DefaultSpreadsSheetsWidgets.Item = function Item({ isHidden , data}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const handleClick = (i: string) => {
    router.push(`./spreadsheets/update/${i}`).then()
  }
  const [isOpen, setIsOpen] = useState(false);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setState({
  //     ...state,
  //     [event.target.name]: event.target.checked,
  //   });
  // };

  const handleOpenModal = (item) => {
    setTitle(item.name);
    setIsOpen(true)
  }


  return (
    <div className="flex flex-col gap-2">
      {data && data.map((item, i) => (
        <div key={item.id} className="flex space-x-8">
          {isHidden && (
            <div className=" flex flex-col items-center justify-center">
              <Button onClick={() => handleClick(item.id)} className="px-3 bg-lightGreen duration-300 shadow-lg hover:text-white hover:bg-lightGreenHover text-center text-white">
                アップデート
              </Button>
              <div className={"text-xs mt-1"}>
              {item.date}
              </div>
            </div>
          )}
          <div>
            <div className=" flex tablet:flex-row items-center mb-2">
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
                  <Button onClick={() => handleOpenModal(item)} className="shadow-lg justify-start px-3 flex bg-lightGreen duration-300 hover:text-white hover:bg-lightGreenHover text-center text-white">
                    Sheet
                    <p className="p-0 m-0 text-xl ml-1">+</p>
                  </Button>
                </div>
              </div>
            </div>
            <Divider />
          </div>
        </div>
      ))}
      <AddSheetModal isOpen={isOpen} handleClose={() => setIsOpen(false)} title={title} />
    </div>
  );
};
