import React from 'react';
import {cloneDeep} from "lodash";
import Dropdown from "@/app/components/custom/Dropdown";

type props = {
  dataRegex: string[]
  type: string
  block: any
  blocks: any
  handleChangeStructureOutPut: (event: any, value: string, type: string) => void
  dataStructIds: any[]
}

function SelectedStructure({dataRegex, handleChangeStructureOutPut, type, blocks, block, dataStructIds}: props) {
  return (
    <div>
      {
        dataRegex?.map((value, idx) => {
          let _blocks = cloneDeep(blocks)
          const idxB = _blocks?.findIndex((s: any) => s.id === block?.id)
          if (idxB === -1) return;
          let _value = block?.data ? type === 'groupsHourStructure' ? _blocks?.[idxB]?.data?.groupsHourStructure.structureId :
            type === 'groupsMinuteStructure' ? _blocks?.[idxB]?.data?.groupsMinuteStructure.structureId :
              _blocks?.[idxB]?.data?.groupsSecondStructure.structureId : ''

          return (
            <div key={idx} className={'grid grid-cols-12 items-center'}>
              <div className={'grid-3'}>
                {value}
              </div>
              <Dropdown dataSelect={dataStructIds}
                        value={_value}
                        className={'grid-9 py-1'}
                        minWidth={450}
                        onChange={(event) => handleChangeStructureOutPut(event, value, type)}
                        renderValue={0}
                        isInPutLabel={true}/>
            </div>
          )
        })
      }
    </div>
  );
}

export default SelectedStructure;
