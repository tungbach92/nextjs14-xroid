import { imageUri } from "@/app/components/assets";
import {IconExcel} from "../components";

export const configSwapSpreadsheetsButton = [
  {
    variable: "left",
    buttonTitle: (
      <div className="flex flex-wrap">
        <img src={imageUri.iconImg.spreadsheetsIcon} />
      </div>
    ),
  },
  {
    variable: "right",
    buttonTitle: <IconExcel />,
  },
];
