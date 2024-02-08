import React, {useState} from 'react';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {MenuItem} from "@mui/material";
import {cloneDeep} from "lodash";
import Box from "@mui/material/Box";
import {characterData, defaultItem, motionData} from "@/app/common/motionData";
import CardCustom from "@/app/components/custom/CardCustom";
import {useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {BlockMotion} from "@/app/types/block";

type props = {
    onDelete: () => void
    onCopy: () => void
    block: BlockMotion
    isShowAddButton?: boolean
    handleGetIndex?: () => void
    handleMultiCopy?: (type: string) => void
}

function MotionTemplate({
                            onCopy,
                            onDelete,
                            block,
                            isShowAddButton,
                            handleGetIndex,
                            handleMultiCopy
                        }: props) {
    const updateBlocks = useSetAtom(readWriteBlocksAtom)
    const [value, setValue] = useState(defaultItem);

    const handleOnChangeMotion = (filed: string, value: string) => {
        const _block = cloneDeep(block)
        _block.data[filed] = value
        updateBlocks(_block)
    }
    return (
        <div>
            <CardCustom isCopy={true} onCopy={onCopy} onDelete={onDelete}
                        block={block}
                        isShowAddButton={isShowAddButton}
                        handleGetIndex={handleGetIndex}
                        handleMultiCopy={handleMultiCopy}
                        title={'Motion'} color={'#CAEB00'}
                        className={'border-2 border-solid border-[#CAEB00] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]'}>
              <div className={'flex items-center gap-2 py-1'}>
                <div className={'text-gray-500'}>
                  {characterData.name}
                </div>
                <Box sx={{width: 130}}>
                  <FormControl size={'small'} fullWidth>
                    <Select
                      value={block?.data[characterData.id]}
                      onChange={(event) => {
                        let newItem = cloneDeep(value)
                                    newItem[characterData.id] = event.target.value
                                    setValue(newItem)
                                    handleOnChangeMotion(characterData.id, event.target.value)
                                }}
                            >
                                {
                                    characterData.choice.map((choice, index) => {
                                        return <MenuItem key={index} value={choice.id}>{choice.value}</MenuItem>
                                    })
                                }

                            </Select>
                        </FormControl>
                    </Box>
                </div>
                {
                    motionData.map((i, index) => {
                        return (
                            <div key={index}>
                                <div className={'flex items-center gap-2 py-1'}>
                                    <div className={'text-gray-500'}>
                                        {i.name}
                                    </div>
                                    <Box sx={{width: 130}}>
                                        <FormControl size={'small'} fullWidth>
                                            <Select
                                                value={block?.data[i.id]}
                                                onChange={(event) => {
                                                    let newItem = cloneDeep(value)
                                                    newItem[i.id] = event.target.value
                                                    setValue(newItem)
                                                    handleOnChangeMotion(i.id, event.target.value)
                                                }}
                                            >
                                                {
                                                    i.choice.map((choice, index) => {
                                                        return <MenuItem key={index} value={choice}>{choice}</MenuItem>
                                                    })
                                                }

                                            </Select>
                                        </FormControl>
                                    </Box>
                                </div>
                            </div>
                        )
                    })
                }
            </CardCustom>
        </div>
    );
}

export default MotionTemplate;
