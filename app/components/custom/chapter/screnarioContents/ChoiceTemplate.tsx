import React, {useMemo} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Dropdown from "@/app/components/custom/Dropdown";
import TextField from "@mui/material/TextField";
import {Button, ListItemText, OutlinedInput} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useAtom, useSetAtom} from "jotai";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import DeleteIcon from '@mui/icons-material/Delete';
import {cloneDeep, includes} from "lodash";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import {getStructParentId} from "@/app/common/getStructParentId";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {BlockChoice, DataChoiceValue} from "@/app/types/block";

type props = {
    onDelete: () => void
    onCopy: () => void
    block: BlockChoice
    structureIds: any
    isShowAddButton?: boolean
    handleGetIndex?: () => void
    handleMultiCopy?: (type: string) => void
}

const NUMBERS_OF_ANSWER = [1, 2, 3, 4]

function ChoiceTemplate({
                            onDelete,
                            onCopy,
                            block,
                            structureIds,
                            isShowAddButton,
                            handleGetIndex,
                            handleMultiCopy
                        }: props) {
    // const [newDataStruct] = useAtom(newDataStructureAtom)
    const [structureData] = useStructureDataAtom();
    const [ids] = useAtom(structureIdInnChapterAtom)
    const updateBlocks = useSetAtom(readWriteBlocksAtom)

    const dataSelect = useMemo(() => {
        let result = []
        if (structureData?.length && structureIds?.length) {
            const selectedStruct = structureData.filter(data => structureIds.includes(data.id))
            selectedStruct.forEach(struct => {
                struct.items.forEach((item) => {
                    if (!item.fieldPath) return;
                    result.push({
                        value: item.id,
                        label: `${struct.name} : ${item.fieldPath}`,
                    })
                })
            })
        }
        return result
    }, [structureData, structureIds])

    const structure = structureData?.map((struct) => {
        if (includes(ids, struct.id))
            return struct
    }).filter((item) => item !== undefined) || []

    const handleOnChangeChoice = (field: string, value: DataChoiceValue, isSetParentId?: boolean) => {
        const _block = cloneDeep(block)
        _block.data[field] = value
        if (isSetParentId)
            _block.data.parentId = getStructParentId(structure, value.toString())
        updateBlocks(_block)
    }
    const onDeleteReferenceItem = (idx: number) => {
        const newData = [...block?.data.referenceData]
        newData.splice(idx, 1)
        handleOnChangeChoice("referenceData", newData)
    }

    return (
        <div>
            <CardCustom isCopy={true} onCopy={onCopy} onDelete={onDelete}
                        block={block}
                        title={'Choice'} color={'#FF9C64'}
                        handleGetIndex={handleGetIndex}
                        handleMultiCopy={handleMultiCopy}
                        isShowAddButton={isShowAddButton}
                        className={'border-2 border-solid border-[#FF9C64] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]'}>
              <div className={'flex flex-col gap-2 text-xs mt-4'}>
                <FormControl sx={{width: 80}} size="small">
                  <InputLabel id="select-label">選択数</InputLabel>
                  <Select
                    labelId="select-label"
                    id="demo-select"
                    value={block?.data?.answerNumber || NUMBERS_OF_ANSWER[0]}
                    onChange={(e) => handleOnChangeChoice("answerNumber", e.target.value, true)}
                    input={<OutlinedInput label="選択数"/>}
                  >
                            {NUMBERS_OF_ANSWER.map((number) => (
                                <MenuItem key={number} value={number}>
                                    <ListItemText primary={number}/>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Dropdown dataSelect={dataSelect}
                        // maxWidth={180}
                              value={block?.data?.dataInput}
                              onChange={(e) => handleOnChangeChoice("dataInput", e.target.value, true)}
                              className={'py-1 pr-5'} renderValue={'参照'}/>
                    <span className='text-sm'>--- 選択肢 ---</span>
                </div>
                {
                    block?.data?.referenceData?.map((item, index) => {
                        return <div key={index}>
                            <div className={"w-full flex justify-between items-center"}>
                                <Dropdown dataSelect={dataSelect}
                                          value={item.dataInput}
                                          onChange={(e) => {
                                              const newData = [...block.data.referenceData]
                                              newData[index].dataInput = e.target.value
                                              newData[index].parentId = getStructParentId(structure, e.target.value.toString())
                                              handleOnChangeChoice("referenceData", newData)
                                          }}
                                          isInPutLabel={true} label={'参照'}
                                    // maxWidth={180}
                                          className={'flex-1 py-3 pr-5'}/>
                                {
                                    block.data.referenceData.length > 1 &&
                                    <DeleteIcon
                                        color={"action"}
                                        onClick={() => onDeleteReferenceItem(index)}
                                    />
                                }
                            </div>
                            {!item.dataInput &&
                                <TextField id="outlined-basic" label="固定値" variant="outlined"
                                           size={'small'} value={item.fixedValue}
                                           onChange={(e) => {
                                               const newData = [...block.data.referenceData]
                                               newData[index].fixedValue = e.target.value
                                               handleOnChangeChoice("referenceData", newData)
                                           }}
                                />}
                        </div>
                    })
                }
                <div>
                    <Button variant="contained" color="primary" endIcon={<AddIcon/>}
                            onClick={() => {
                                const newData = [...block.data.referenceData]
                                newData.push({
                                    fixedValue: "",
                                    dataInput: ""
                                })
                                handleOnChangeChoice("referenceData", newData)
                            }}
                            className={'w-1/3 mt-2 bg-[#FF9C64]'}>追加</Button>
                </div>
            </CardCustom>
        </div>
    );
}

export default ChoiceTemplate;
