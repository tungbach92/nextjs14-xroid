import React, {useEffect, useMemo, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {Tab, Tabs, Tooltip} from "@mui/material";
import {DEFAULT_COLOR} from "@/app/configs/constants";
import {useAtom, useSetAtom} from "jotai";
import {blocksAtom, readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {cloneDeep, includes} from "lodash";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import SelectedStructure from "@/app/components/custom/SelectedStructure";
import InputAdornmentCustom from "@/app/components/custom/InputAdornmentCustom";
import TooltipTitle from "@/app/components/custom/TooltipTitle";
import {BlockTimerStart, BlockTimerTrigger} from "@/app/types/block";

type TimerTemplateProps = {
    onDelete: () => void
    onCopy: () => void
    isShowAddButton?: boolean
    handleGetIndex?: () => void
    handleMultiCopy?: (type: string) => void
    block: BlockTimerStart | BlockTimerTrigger
    blockType?: string
}


function TimerStartTemplate({
                                onDelete, onCopy,
                                block, handleMultiCopy,
                                handleGetIndex, isShowAddButton,
                                blockType
                            }: TimerTemplateProps) {
    const [hours, setHours] = useState<string>('')
    const [minutes, setMinutes] = useState<string>('')
    const [seconds, setSeconds] = useState<string>('')
    const [blocks, setBlocks] = useAtom(blocksAtom)
    const [color, setColor] = useState<string>('#E1CB02')
    const [ids] = useAtom(structureIdInnChapterAtom)
    const [structureDataAtom] = useStructureDataAtom();
    const [hoursRegex, setHoursRegex] = useState<string[]>([])
    const [minutesRegex, setMinutesRegex] = useState<string[]>([])
    const [secondsRegex, setSecondsRegex] = useState<string[]>([])
    const [tabValue, setTabValue] = useState<number>(1)
    const updateBlocks = useSetAtom(readWriteBlocksAtom)

    useEffect(() => {
        if (block) {
            setHours(block.data.groupsHourStructure.userInput)
            setMinutes(block.data.groupsMinuteStructure.userInput)
            setSeconds(block.data.groupsSecondStructure.userInput)
            if (blockType === 'timer') {
                const _block = cloneDeep(block) as BlockTimerStart
                setTabValue(_block.data.countType === 'countDown' ? 1 : 2)
                setColor(_block.data.color)
            }
        }
    }, [block])

    const findRegex = (str: string) => {
        const matches = str?.match(/\{[^}]+\}|\｛[^｝]+\｝/g);
        const dataRegex = matches?.map((match) => {
            return match
        }).filter((item) => item !== null)
        if (!dataRegex) return []
        return [dataRegex[0]] || []
    }

    useEffect(() => {
        setHoursRegex(findRegex(hours))
    }, [hours])

    useEffect(() => {
        setMinutesRegex(findRegex(minutes))
    }, [minutes])

    useEffect(() => {
        setSecondsRegex(findRegex(seconds))
    }, [seconds])


    const handleChangeTime = (e, type: string) => {
        const _block = cloneDeep(block)
        const groupsTimeStructure = block.data[type]
        const _groupsTimeStructure = {...groupsTimeStructure}
        _groupsTimeStructure.userInput = e.target.value
        _block.data = {
            ...block.data,
            [type]: _groupsTimeStructure,
        }
        updateBlocks(_block)
    }
    const handleChangeCountType = (t: string) => {
        const _block = cloneDeep(block)
        _block.data = {
            ...block.data,
            countType: t
        }
        updateBlocks(_block)
    }

    const handleChangeColor = (c: string) => {
        const _block = cloneDeep(block)
        _block.data = {
            ...block.data,
            color: c
        }
        updateBlocks(_block)
    }

    const structure = structureDataAtom?.map((struct) => {
        if (includes(ids, struct.id))
            return struct
    }).filter((item) => item !== undefined) || []

    const dataStructIds = useMemo(() => {
        let data = []
        structure?.forEach((item) => {
            item.items.forEach((i) => {
                if (!i.fieldPath) return;
                data.push({
                    value: i.id,
                    label: `${item.name} : ${i.fieldPath}`,
                })
            })
        })
        return data
    }, [structure])

    const handleChangeStructureOutPut = (e, value, type) => {
        const _block = cloneDeep(block)
        const parentId = structure.find((item) => item.items.find((i) => i.id === e.target.value))?.id
        const groupsTimeStructure = block.data[type]
        const _groupsTimeStructure = {...groupsTimeStructure}
        _groupsTimeStructure.structureId = e.target.value
        _groupsTimeStructure.parentId = parentId
        _groupsTimeStructure.value = value
        _block.data = {
            ...block.data,
            [type]: _groupsTimeStructure
        }
        updateBlocks(_block)
    }
    const getType = (newValue: number) => {
        if (newValue === 1) return 'countDown'
        if (newValue === 2) return 'countUp'
    }
    return (
        <CardCustom isCopy={true} onCopy={onCopy}
                    block={block}
                    isShowAddButton={isShowAddButton}
                    handleMultiCopy={handleMultiCopy}
                    handleGetIndex={handleGetIndex}
                    onDelete={onDelete} title={` ${blockType === 'timer' ? 'Timer start' : 'Timer Trigger'}`}
                    color={'#ff0000'}
                    className={`border-2 border-solid border-[#ff0000] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] w-full`}
        >
            <div>
                <div className={`flex justify-end gap-3 ${blockType === 'timer' ? '-mt-12' : ''}`}>
                    {blockType === 'timer' &&
                        <Tabs value={tabValue}
                              onChange={(event: any, newValue: any) => {
                                  setTabValue(newValue)
                                  handleChangeCountType(getType(newValue))
                              }}
                              TabIndicatorProps={{
                                  style: {
                                      backgroundColor: '#ff0000'
                                  }
                              }}
                              textColor="secondary"
                              aria-label="anim_tab"
                              variant={'scrollable'}>
                            <Tab value={1} label="カウントダウン"/>
                            <Tab value={2} label="カウントアップ"/>
                        </Tabs>
                    }
                </div>
                <div className={'pt-3 flex'}>
                    <InputAdornmentCustom value={hours} text={'時間'}
                                          onChange={(e) => handleChangeTime(e, 'groupsHourStructure')}/>
                    <InputAdornmentCustom value={minutes} text={'分'}
                                          onChange={(e) => handleChangeTime(e, 'groupsMinuteStructure')}/>
                    <InputAdornmentCustom value={seconds} text={'秒'}
                                          onChange={(e) => handleChangeTime(e, 'groupsSecondStructure')}/>
                </div>
                <div className={'flex pt-3 justify-between mr-20 items-center'}>
                    <div className={`max-w-fit  rounded-md bg-[#ff0000]`}>
                        <div className={'py-2 px-2 text-xs'}>
                            シンプル
                        </div>
                    </div>
                    <div className={'flex items-center'}>
                        {
                            blockType === 'timer' && (
                                <div className={'flex items-center'}>
                                    <div className={'pr-3'}>タイマーの色</div>
                                    <Tooltip
                                        title={<TooltipTitle listColor={DEFAULT_COLOR}
                                                             onSelect={(color) => handleChangeColor(color)}/>}
                                        placement={'top-start'}
                                        componentsProps={{
                                            tooltip: {
                                                sx: {
                                                    borderRadius: '10px',
                                                    border: '2px solid #E5E5E5',
                                                    bgcolor: 'white',
                                                    '& .MuiTooltip-arrow': {
                                                        color: 'common.black',
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <svg width={40} height={40}>
                                            <circle cx={20} cy={20} r={20} fill={color}/>
                                        </svg>
                                    </Tooltip>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div>
                    <SelectedStructure dataRegex={hoursRegex}
                                       block={block} blocks={blocks}
                                       dataStructIds={dataStructIds}
                                       type={'groupsHourStructure'}
                                       handleChangeStructureOutPut={handleChangeStructureOutPut}/>
                    <SelectedStructure dataRegex={minutesRegex}
                                       block={block} blocks={blocks}
                                       dataStructIds={dataStructIds}
                                       type={'groupsMinuteStructure'}
                                       handleChangeStructureOutPut={handleChangeStructureOutPut}/>
                    <SelectedStructure dataRegex={secondsRegex}
                                       block={block}
                                       blocks={blocks}
                                       dataStructIds={dataStructIds}
                                       type={'groupsSecondStructure'}
                                       handleChangeStructureOutPut={handleChangeStructureOutPut}
                    />
                </div>

            </div>
        </CardCustom>
    );
}

export default TimerStartTemplate;




