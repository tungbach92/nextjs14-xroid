import React, {useEffect} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {TextField} from '@mui/material';
import {readWriteBlocksAtom} from '@/app/store/atom/blocks.atom';
import {useSetAtom} from 'jotai';
import {cloneDeep} from "lodash";
import {BlockDelay} from "@/app/types/block";
import {convertInputNumber} from "@/app/common/convertNumber";

type props = {
    onDelete: () => void
    onCopy: () => void
    isShowAddButton?: boolean
    handleGetIndex?: () => void
    handleMultiCopy?: (type: string) => void
    block: BlockDelay
}

function DelayTemplate({
                           block,
                           onCopy,
                           onDelete,
                           isShowAddButton,
                           handleMultiCopy,
                           handleGetIndex
                       }: props) {
    const updateBlocks = useSetAtom(readWriteBlocksAtom)
    const [seconds, setSeconds] = React.useState(block?.data?.seconds || 0)
    useEffect(() => {
        const _block = cloneDeep(block)
        _block.data.seconds = seconds
        updateBlocks(_block)
    }, [seconds])

    const handleOnChangeCounter = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSeconds(Number(e.target.value))
    }

    return (
        <div className={'h-full'}>
            <CardCustom isCopy={true} onCopy={onCopy} onDelete={onDelete}
                        block={block}
                        title={'Delay'} color={'#85F1AA'}
                        isShowAddButton={isShowAddButton}
                        handleGetIndex={handleGetIndex}
                        handleMultiCopy={handleMultiCopy}
                        className={'border-2 border-solid border-[#85F1AA] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full'}>
              <TextField id="outlined-basic"
                         defaultValue={block?.data?.seconds || 0}
                         label="秒を入力してください"
                         onChange={handleOnChangeCounter}
                         variant="outlined" size={'small'}
                         value={convertInputNumber(seconds)}
                         type='number'
                         InputProps={{inputProps: {min: 0}}}
                         className={'w-1/2 my-4'}/>
            </CardCustom>
        </div>
    );
}

export default DelayTemplate;
