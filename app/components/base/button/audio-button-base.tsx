import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import { FormEventHandler, MouseEventHandler } from "react";

interface AudioButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  titleButton?: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  onChange?: FormEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const AudioButtonBase: React.FC<AudioButtonBaseProps> = ({
  Icon,
  titleButton,
  className,
  onChange,
  onClick,
}) => {
  return (
    <button
      onChange={onChange}
      onClick={onClick}
      className={`border cursor-pointer justify-center group rounded-lg items-center flex py-0 px-4 space-x-1 hover:bg-blue-400 duration-300 ${className}`}
    >
      <h1 className="font-light text-lg group-hover:text-white duration-300">{titleButton}</h1>
      <Icon sx={{ width: 40, height: 30 }} className="group-hover:text-white duration-300" />
    </button>
  );
};
