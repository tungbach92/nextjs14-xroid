import React, {DetailedHTMLProps, HTMLAttributes} from "react";

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const CardSheet = ({className, children}: Props) => {
  let classTxt = "border-3 border-solid border-gray-300 rounded p-[15px] bg-white ";
  if (className) classTxt += className;
  return (
    <>
      <div className={classTxt}>
        {children}
      </div>
    </>
  )
}