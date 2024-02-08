import {
  DefaultSpreadsSheetsWidgets,
  LayoutSpreadSheets,
  LinkSpreadsSheetsWidgets,
  SwapSpreadsheetsButton,
} from "@/app/components/spreadsheets";
import {useState} from "react";
import exelFolders from "@/app/components/spreadsheets/json/excel-folders.json";
import useFolders from "@/app/hooks/useFolders";

function Spreadsheets(props) {
  const [alignment, setAlignment] = useState("left");
  useFolders();

  return (
    <LayoutSpreadSheets>
      <div className="flex justify-end ">
        <SwapSpreadsheetsButton setAlignment={setAlignment} alignment={alignment} />
      </div>
      <div className="flex justify-start mt-2 ">
        {alignment === "left" ? <DefaultSpreadsSheetsWidgets data={exelFolders} /> : <LinkSpreadsSheetsWidgets data={exelFolders} />}
      </div>
    </LayoutSpreadSheets>
  );
}

export default Spreadsheets;
