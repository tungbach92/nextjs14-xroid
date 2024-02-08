import {Button, Divider} from "@mui/material";
import {imageUri} from "@/app/components/assets";
import SideBarRight from "@src/components/Layout/Sidebar/side-bar-right";
import {PropsWithChildren} from "react";
import {useAtom} from "jotai";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import {selectedFolderAtom} from "@/app/store/atom/selectedFolder.atom";

export interface ModalSpreadSheetsLayoutProps extends PropsWithChildren {
  className?: string;
  titleButton?: string;
}

export const ModalSpreadSheetsLayout: React.FC<ModalSpreadSheetsLayoutProps> = ({
                                                                                  children,
                                                                                  className,
                                                                                  titleButton,
                                                                                }) => {
  const [folders, setFolders] = useAtom(foldersAtom)
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  return (
    <div>
      <div className="flex space-x-6 px-5 items-center">
        <img src={imageUri.iconImg.iconStructures} alt=""/>
        <h2>データ構造</h2>
        <Button className={`border-none px-2 py-1 rounded-sm font-bold bg-gray-200 text-black shadow-sm ${className}`}>
          {titleButton}
        </Button>
      </div>
      <Divider/>
      <div className="flex ">
        <div className="flex-1">{children}</div>
        <Divider orientation="vertical" flexItem/>
        <SideBarRight className={"min-h-0 rounded-xl"} folders={folders} selectedFolder={selectedFolder}
                      setFolders={setFolders} setSelectedFolder={setSelectedFolder}/>
      </div>
    </div>
  );
};
