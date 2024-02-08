import React from 'react';
import Image from "next/image";
import {Avatar} from "@/app/components/Mentaloids/base/Avatar";
import {Character} from "@/app/types/types";
import {Add} from "@mui/icons-material";
import {isFunction} from "lodash";

type Props = {
  characters: Character[],
  onDeleteCharacter?: (id: string) => void,
  onSelectedCharacter?: (id: string) => void
  onClickCopy?: (id: string) => void
  selectedChar?: Character
  onOpenModal?: () => void
  btnAddClassName?: string
  rowTittle?: string
  isSuperAdmin?: boolean
}

function RenderCharacter({
                           characters,
                           onDeleteCharacter,
                           onSelectedCharacter,
                           selectedChar,
                           onOpenModal,
                           btnAddClassName,
                           rowTittle,
                           onClickCopy,
                           isSuperAdmin = false
                         }: Props) {
  return (
    <div className={'w-full text-black grid grid-cols-12'}>

      <div className={'flex my-auto pr-2 col-span-2 justify-between'}>
        <span className={'my-auto'}>{rowTittle}</span>
        <div className={'w-[1px] h-[60px] bg-black '}/>
      </div>

      <div className={'flex gap-3 col-span-8 overflow-x-auto'}>
        {
          characters?.map((c, index) => {
              return (
                <div className='relative group my-2' key={c?.id}>
                  {
                    c?.userId ?
                      <Image
                        className='absolute hidden top-[15%] left-[100%] -translate-y-1/2 -translate-x-1/2 cursor-pointer p-0.5 rounded-full bg-white group-hover:flex hover:bg-gray-300 z-50'
                        onClick={() => {
                          onDeleteCharacter(c?.id)
                        }}
                        src='/icons/trash-icon.svg'
                        alt='trash-icon'
                        width={25}
                        height={25}
                      /> :
                      <Image
                        className='absolute hidden top-[15%] left-[90%] -translate-y-1/2 -translate-x-1/2 cursor-pointer p-0.5 rounded-full bg-white group-hover:flex hover:bg-gray-300 z-50'
                        onClick={() => {
                          if (isFunction(onClickCopy)) onClickCopy(c?.id)
                        }}
                        src='/icons/_レイヤ).svg'
                        alt='trash-icon'
                        width={20}
                        height={20}
                      />

                  }
                  <Avatar
                    src={c?.avatar}
                    alt={c?.name}
                    isBorder={c?.id === selectedChar?.id}
                    onClick={() => onSelectedCharacter(c?.id)}
                  />
                </div>
              )
            }
          )
        }
      </div>
      <div className={'col-span-2 my-auto'}>
        {(rowTittle === 'ロイド' || (isSuperAdmin && rowTittle === 'デフォルト')) &&
          <Avatar className={btnAddClassName}>
            <Add
              sx={{fontSize: "40px"}}
              className={`text-shade-blue`}
              onClick={onOpenModal}
            />
          </Avatar>
        }
      </div>
    </div>

  );
}

export default RenderCharacter;
