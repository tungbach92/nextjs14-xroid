import {PropsWithChildren, useState} from "react";
import Folder from "@/app/common/data/svgData/folder-open-icon.svg";
import {Drawer} from "@mui/material";
import {useAtom} from "jotai";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import {selectedFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import SideBarRight from "@/app/components/Layout/Sidebar/side-bar-right";

interface LayoutSpreadSheetsProps extends PropsWithChildren {
}

export const LayoutSpreadSheets: React.FC<LayoutSpreadSheetsProps> = ({children}) => {
  const [isDrawer, setIsDrawer] = useState(false);
  const [folders, setFolders] = useAtom(foldersAtom)
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  return (
    <div className="mx-10 flex  laptop:mx-0 ">
      <Drawer anchor={"right"} open={isDrawer} onClose={() => setIsDrawer(false)}>
        <div className="mt-16">
          <SideBarRight folders={folders} selectedFolder={selectedFolder} setFolders={setFolders}
                        setSelectedFolder={setSelectedFolder}/>
        </div>
      </Drawer>
      <div className="flex-1  my-3 laptop:my-12 laptop:mx-32">{children}</div>
      <div
        onClick={() => setIsDrawer(true)}
        className=" cursor-pointer flex mt-4 hover:border-lightGreenHover rounded-lg duration-200 border-dashed border-[2px] p-1 max-h-[30px] laptop:hidden justify-end"
      >
        <Folder fill="gray" width={24} height={18}/>
      </div>
      <div className="hidden  laptop:flex justify-end">
        <SideBarRight folders={folders} selectedFolder={selectedFolder} setFolders={setFolders}
                      setSelectedFolder={setSelectedFolder}/>
      </div>
    </div>
  );
};
