import React from 'react';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Paper from "@mui/material/Paper";
import ClearIcon from "@mui/icons-material/Clear";
import {Block} from "@/app/types/block";

type Props = {
  addNewBlocks: Block[],
  handleDeleteSelectedBlock: (index: number) => void

}

function ActionModalChild({addNewBlocks, handleDeleteSelectedBlock}: Props) {

  function toTitleCase(str) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function (s) {
        return s.toUpperCase();
      });
  }

  return (
    <div className={'gap-4 pb-5'}>
      <span className={'font-bold'}>選択したブロックのプレビュー</span>
      <div className={'flex overflow-x-auto gap-2'}>
        {addNewBlocks?.length > 0 && addNewBlocks?.map((item, index) => {
          return (
            <div
              key={item.id}
              className={'flex min-w-fit pt-3 cursor-pointer group'}
              onClick={() => handleDeleteSelectedBlock(index)}
            >
              {index === 0 ? null : (<div className={'m-auto mr-2'}><ArrowForwardIosIcon className={'w-4'}/></div>)}
              <Paper
                className={'bg-[#3AD1FF] px-2 py-1 rounded text-center m-auto text-xs relative ' +
                  'group-hover:opacity-200 group-hover:bg-gray-100 group-hover:text-gray-400'}>
                {toTitleCase(item.type) + ' Block'}
                <ClearIcon
                  className={'absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-4 opacity-0 ' +
                    'group-hover:opacity-100 hover:opacity-100 z-10'}
                  color={'error'}
                  sx={{zIndex: 999}}
                />
              </Paper>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default ActionModalChild;
