import React, {useMemo} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Dropdown from "@/app/components/custom/Dropdown";
import TextField from "@mui/material/TextField";
import {useAtom, useSetAtom} from "jotai";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {readWriteBlocksAtom} from '@/app/store/atom/blocks.atom';
import {cloneDeep, includes} from "lodash";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import {getFieldPath, getStructParentId} from "@/app/common/getStructParentId";
import {BlockInput, DataInputValues} from "@/app/types/block";
import {convertInputNumber} from "@/app/common/convertNumber";

type props = {
    onDelete: () => void
    onCopy: () => void
    isNumberTemplate?: boolean
    block: BlockInput
    isShowAddButton?: boolean
    handleGetIndex?: () => void
    handleMultiCopy?: (type: string) => void
}

function InputTemplate({
                           onCopy,
                           onDelete,
                           isNumberTemplate,
                           block,
                           isShowAddButton,
                           handleGetIndex,
                           handleMultiCopy
                       }: props) {
    const updateBlocks = useSetAtom(readWriteBlocksAtom)
    // const [newDataStruct] = useAtom(newDataStructureAtom)
    const [structureData] = useStructureDataAtom();
    const [ids] = useAtom(structureIdInnChapterAtom)
    const dataSelect = useMemo(() => {
      let result: { value: string, label: string }[] = []
        if (structureData?.length && ids?.length) {
            const selectedStruct = structureData.filter(i => includes(ids, i.id))
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
    }, [structureData, ids])

    const structure = structureData?.map((struct) => {
        if (includes(ids, struct.id))
            return struct
    }).filter((item) => item !== undefined) || []

  const handleOnChangeStruct = (field: string, value: DataInputValues) => {
    const _block = cloneDeep(block)
    _block.data[field] = value
    _block.data.parentId = getStructParentId(structure, value.toString())
    _block.data.fieldPath = getFieldPath(structure, value.toString())
    updateBlocks(_block)
  }

    return (
        <div className={'h-full'}>
            <CardCustom isCopy={true} onCopy={onCopy} onDelete={onDelete}
                        block={block}
                        title={'Input'} color={'#FF9C64'}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        isShowAddButton={isShowAddButton}
                        className={'border-2 border-solid border-[#FF9C64] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full'}>
              <div className={'flex gap-3'}>
                <Dropdown dataSelect={dataSelect} value={block?.data?.dataInput}
                          onChange={(event) => handleOnChangeStruct("dataInput", event.target.value)}
                          minWidth={130} className={'py-4 pr-5 flex-1'}/>
                {/*<FormControlLabel control={<Checkbox checked={block.data.isEneColorBar}*/}
                {/*                                     onChange={(event) => handleOnChangeStruct("isEneColorBar", event.target.checked)}/>}*/}
                {/*                  label="エネカラーバー"/>*/}
              </div>
              {
                isNumberTemplate && <div className={'flex pt-4 gap-2'}>
                  <TextField id="outlined-basic" label="最小値" variant="outlined"
                             InputProps={{inputProps: {min: 0, max: block?.data?.max}}}
                             value={convertInputNumber(block?.data?.min)}
                             onChange={(event: any) => {
                               const value = Number(event.target.value)
                               if (value < block?.data?.max)
                                 handleOnChangeStruct("min", value)
                             }}
                             type={'number'} size={'small'} className={'w-1/3'}/>
                  <TextField id="outlined-basic" label="最大値" variant="outlined"
                                   InputProps={{inputProps: {min: block?.data?.min}}}
                                   value={convertInputNumber(block?.data?.max)}
                                   onChange={(event: any) => {
                                       const value = Number(event.target.value)
                                       if (value > block?.data?.min)
                                           handleOnChangeStruct("max", value)
                                   }}
                                   type={'number'} size={'small'} className={'w-1/3'}/>
                    </div>
                }
            </CardCustom>
        </div>
    );
}

export default InputTemplate;
