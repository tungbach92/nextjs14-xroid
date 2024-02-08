import TextField from "@mui/material/TextField";
import CardCustom from "@/app/components/custom/CardCustom";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {useSetAtom} from "jotai";
import React, {useEffect, useState} from 'react';
import {cloneDeep} from "lodash";
import {BlockForStart} from "@/app/types/block";
import {convertInputNumber} from "@/app/common/convertNumber";

type props = {
    block: BlockForStart
    onDelete: () => void
    onCopy: () => void
    isShowAddButton?: boolean
    handleGetIndex?: () => void
    handleMultiCopy?: (type: string) => void
}

function For_StartTemplate({
                               block,
                               onCopy,
                               onDelete,
                               isShowAddButton,
                               handleMultiCopy,
                               handleGetIndex
                           }: props) {
    const updateBlocks = useSetAtom(readWriteBlocksAtom)
    const [condition, setCondition] = useState<string>(block?.data?.condition || '')
    const [counter, setCounter] = useState<number>(block?.data?.counter || 0)

    useEffect(() => {
        const _block = cloneDeep(block)
        _block.data.condition = condition
        _block.data.counter = counter
        updateBlocks(_block)
    }, [condition, counter])

    const handleOnChangeCondition = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCondition(e.target.value)
    }
    const handleOnChangeCounter = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCounter(Number(e.target.value))
    }

    return (
        <div className={'min-w-[600px] h-full'}>
            <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                        block={block}
                        title={'For_start'} color={'#CAEB00'}
                        isShowAddButton={isShowAddButton}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        className={'border-2 border-solid border-[#CAEB00] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]'}>
                <div className={'pt-2 text-xs flex flex-col'}>
                    <TextField id="outlined-basic" label="終了条件式"
                               value={condition}
                               variant="outlined" size={'small'}
                               onChange={handleOnChangeCondition}
                               className={'w-1/2 my-4'}/>
                </div>
                <div className={'text-gray-500 text-sm'}>
                    カウンター
                </div>
                <TextField id="outlined-basic"
                           label="秒を入力してください"
                           onChange={handleOnChangeCounter}
                           value={convertInputNumber(counter)}
                           variant="outlined" size={'small'}
                           type='number'
                           InputProps={{inputProps: {min: 0}}}
                           className={'w-1/2 my-4'}/>
            </CardCustom>
        </div>
    );
}

export default For_StartTemplate;
