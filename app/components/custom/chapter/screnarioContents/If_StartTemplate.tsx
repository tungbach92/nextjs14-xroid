import React, {useEffect} from 'react';
import TextField from "@mui/material/TextField";
import CardCustom from "@/app/components/custom/CardCustom";
import {useSetAtom} from 'jotai';
import {readWriteBlocksAtom} from '@/app/store/atom/blocks.atom';
import {cloneDeep} from "lodash";
import {BlockIfStart} from "@/app/types/block";

type props = {
    block: BlockIfStart
    onDelete: () => void
    onCopy: () => void
    isShowAddButton?: boolean
    handleGetIndex?: () => void
    handleMultiCopy?: (type: string) => void
}

function If_StartTemplate({
                              onDelete,
                              onCopy,
                              block,
                              isShowAddButton,
                              handleGetIndex,
                              handleMultiCopy
                          }: props) {
    const updateBlocks = useSetAtom(readWriteBlocksAtom)
    const [condition, setCondition] = React.useState(block?.data?.condition || '')
    useEffect(() => {
        const _block = cloneDeep(block)
        block.data.condition = condition
        updateBlocks(_block)
    }, [condition])

    const handleOnChangeIfStart = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCondition(e.target.value)
    }

    return (
        <div>
            <div className={'min-w-[600px] h-full'}>
                <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                            block={block}
                            title={'If_start'} color={'#CAEB00'}
                            isShowAddButton={isShowAddButton}
                            handleMultiCopy={handleMultiCopy}
                            handleGetIndex={handleGetIndex}
                            className={' border-2 border-solid border-[#CAEB00] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]'}>
                    <div className={'text-xs flex flex-col'}>
                        <TextField id="outlined-basic"
                                   onChange={handleOnChangeIfStart}
                                   value={condition}
                                   label="条件式"
                                   variant="outlined"
                                   size={'small'}
                                   className={'w-1/2 my-4'}/>
                        <div className='text-sm py-3'>--- 引数 ---</div>
                    </div>
                </CardCustom>
            </div>
        </div>
    );
}

export default If_StartTemplate;
