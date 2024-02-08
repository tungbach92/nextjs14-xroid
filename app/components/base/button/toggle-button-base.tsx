import { ToggleButtonGroup, ToggleButtonGroupProps } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";

interface ConfigToggleButton {
  buttonTitle: string | JSX.Element;
  variable: string;
}

export interface ToggleButtonProps extends ToggleButtonGroupProps {
  configToggleButton?: ConfigToggleButton[];
  alignment?: string;
}

export const ToggleButtonBase: React.FC<ToggleButtonProps> = ({
  alignment,
  configToggleButton,
  className,
  onChange,
}) => {
  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={onChange}
      aria-label="text alignment"
      className="bg-gray-100  max-h-10"
    >
      {configToggleButton.map((item, i) => (
        <ToggleButton value={item.variable} aria-label="left aligned" key={i} color="primary" className={`py-0`}>
          <div
            className={` ${item.variable === alignment && "text-blue-600"} text-lg text-black font-bold ${className}`}
          >
            {item.buttonTitle}
          </div>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
