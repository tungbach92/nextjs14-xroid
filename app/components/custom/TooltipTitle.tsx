import React from 'react';
import {isArray} from "lodash";

type props = {
  listColor: string[]
  onSelect: (color: string) => void
}

function TooltipTitle({listColor, onSelect}: props) {

  return <div className={'grid grid-cols-8 gap-3 bg-white h-full w-full'}>
    {
      isArray(listColor) &&
      listColor.map((color: any) => {
        return (
          <div key={color} className={'cursor-pointer'} onClick={() => onSelect(color)}>
            <svg width={20} height={20}>
              <circle cx={10} cy={10} r={10} fill={color}/>
            </svg>
          </div>
        )
      })}
  </div>
}

export default TooltipTitle;
