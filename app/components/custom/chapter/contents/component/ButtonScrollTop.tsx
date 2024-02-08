import Button from "@mui/material/Button";
import React, {MutableRefObject} from "react";
import {useAtomValue} from "jotai";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {VirtuosoHandle} from "react-virtuoso";

interface Props {
  virtuosoRef?: MutableRefObject<VirtuosoHandle>
}

export const ButtonScrollTop = ({virtuosoRef}: Props) => {
  const blocks = useAtomValue(blocksAtom)
  return (
    <Button className={'absolute bottom-[100px] right-[50px] z-[50]'} onClick={() => {
      virtuosoRef.current.scrollToIndex({
      // @ts-ignore
        index: blocks[0],
        behavior: "auto"
      })

    }}>
      {/*<ArrowCircleUp className={'w-16 h-16 text-blue-500'}/>*/}
      <img alt={''} src={'/backTopBtn.svg'} className={'w-16 h-16 object-contain'}/>
    </Button>
  )
}
