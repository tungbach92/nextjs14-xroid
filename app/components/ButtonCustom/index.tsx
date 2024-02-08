import React from "react";
import {Button, ButtonGroup} from "@mui/material";
import {isFunction} from "lodash";

type Props = {
  buttonProps: any[];
  className?: string;
};

function ButtonGroupCustom({ buttonProps, className }: Props) {
  return (
    <ButtonGroup
      disableElevation
      variant="outlined"
      aria-label="Disabled elevation buttons"
      className={`flex ${className}`}
    >
      {buttonProps.map((item, index) => {
        return (
          <Button
            key={index}
            variant="text"
            title={item?.name}
            className={`flex items-center normal-case ${className} ${
              (item.checkActive === index + 1 || item.checkActive === true) ? "bg-blue-200" : "text-black"
            }`}
            onClick={item.onClick}
            onContextMenu={isFunction(item?.onContextMenu) ? item.onContextMenu : null}
          >
            {item.button}
            {
              item?.name && <span className={`line-clamp-1 w-[55px] ${className}`}>{item?.name}</span>
            }
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

export default ButtonGroupCustom;
