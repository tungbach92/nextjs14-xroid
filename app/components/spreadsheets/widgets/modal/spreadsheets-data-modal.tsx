import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { imageUri } from "@/app/components/assets";
import { BaseModal, BaseModalProps } from "@/app/components/base";
import { configsModalData } from "./configs";
import { ModalSpreadSheetsLayout } from "./layout";

interface SpreadSheetsDataModalProps extends BaseModalProps {}

interface SpreadSheetsDataProps {
  title?: string;
  files?: {
    fileName: string;
    value: string;
  }[];
}
interface SpreadSheetsDataModalItem {
  configsData?: SpreadSheetsDataProps[];
}

interface Props {
  Item: React.FC<SpreadSheetsDataModalItem>;
}

export const SpreadSheetsDataModal: React.FC<SpreadSheetsDataModalProps> & Props = ({ isOpen, handleClose }) => {
  return (
    <BaseModal className="bg-white rounded-lg pb-8 flex flex-col " isOpen={isOpen} handleClose={handleClose}>
      <ModalSpreadSheetsLayout titleButton="Data Set +">
        <div className="flex flex-col px-10">
          <p>既存ファイル</p>
          <SpreadSheetsDataModal.Item configsData={configsModalData} />
        </div>
      </ModalSpreadSheetsLayout>
    </BaseModal>
  );
};

SpreadSheetsDataModal.Item = function Item({ configsData }) {
  return (
    <div className="flex flex-col max-w-5xl overflow-y-scroll max-h-96  space-y-4">
      {configsData.map((items, i) => (
        <div className="flex  space-x-4 flex-wrap items-center" key={i}>
          <img src={imageUri.iconImg.iconStructures} alt="" />
          <p className="text-sm">{items.title}</p>
          <div className="flex flex-wrap overflow-scroll">
            {items.files.map((item, i) => (
              <div className="bg-gray-200 relative m-1 w-32 flex justify-start py-2 rounded-sm shadow-sm" key={i}>
                <div className="flex flex-col px-3 space-y-1 items-start">
                  <p className="text-xs my-0">{item.fileName}</p>
                  <div className="bg-gray-300 flex space-x-1 px-1 items-center rounded-sm">
                    <p className="text-[10px] text-blue-500 my-0">{item.value}</p>
                    <KeyboardArrowDownIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute top-1 hover:scale-125 duration-200 right-1">
                  <CloseIcon className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
