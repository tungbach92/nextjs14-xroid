import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import TextField from "@mui/material/TextField";
import React, {SetStateAction, useEffect, useMemo, useState} from "react";
import {cloneDeep} from "lodash";
import {useRouter} from "next/navigation";
import {useAtom} from "jotai";
import {selectedStructureFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {DataStructure} from "@/app/types/types";
import {checkValidateStructures} from "@/app/common/checkValidateStructures";

type Props = {
  dataStructure: DataStructure
  idValidate: string[]
  onCopy: (data: DataStructure) => void
  onDelete: (data: DataStructure) => void
  structureInChapter?: DataStructure[]
  setListDataStructure: React.Dispatch<SetStateAction<DataStructure[]>>
  draftSelectedStructures?: DataStructure[];
  setDraftSelectedStructures?: React.Dispatch<SetStateAction<DataStructure[]>>
  inChapter?: boolean
  inputRef?: any,
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  setIdValidate: React.Dispatch<SetStateAction<string[]>>
}

function ListData({
  dataStructure,
  onCopy,
  onDelete,
  idValidate,
  structureInChapter,
  setListDataStructure,
  draftSelectedStructures = [],
  setDraftSelectedStructures,
  inChapter,
  inputRef,
  onBlur,
  setIdValidate
}: Props) {
  const [name, setName] = useState('')
  const router = useRouter()
  const [selectedStructFolder] = useAtom(selectedStructureFolderAtom);
  const selectedStructIds = useMemo(() => draftSelectedStructures?.map(item => item.id), [draftSelectedStructures])
  useEffect(() => {
    setName(dataStructure?.name)
  }, [dataStructure])
  const onchangeName = (e) => {
    setName(e.target.value)
  }
  const onBlurs = () => {
    const _structure = cloneDeep(structureInChapter)
    const idx = _structure.findIndex(item => item.id === dataStructure?.id)
    if (idx === -1) return
    _structure[idx].name = name
    setListDataStructure(_structure)
    checkValidateStructures({listDataStructure: _structure, setIdValidate})
  }

  const handleSelectStructure = () => {
    const _draftSelectedStructures = [...draftSelectedStructures]
    if (selectedStructIds.includes(dataStructure.id)) {
      const _draftSelectedStructures = draftSelectedStructures.filter(x => x.id !== dataStructure.id)
      setDraftSelectedStructures(_draftSelectedStructures)
      return
    }
    _draftSelectedStructures.push(dataStructure)
    setDraftSelectedStructures?.(_draftSelectedStructures)
  }
  return (
    <div
      title={selectedStructIds?.includes(dataStructure.id) ? 'Click To Unselect' : 'Click To Select'}
      className={`w-44 min-h-[150px] flex flex-col justify-between p-2 hover:scale-110 cursor-pointer`}
      onClick={handleSelectStructure}>
      <div
        className={`bg-[#E5F1FF] ${selectedStructIds?.includes(dataStructure.id) && 'border-2 border-solid border-darkBlue rounded-md'}`}>
        <div className={'flex justify-end min-h-[24px]'}>
          {!inChapter && <>
            <ContentCopyIcon
              className={'w-5 cursor-pointer'}
              onClick={() => onCopy(dataStructure)}/>
            <DeleteOutlineOutlinedIcon
              onClick={() => onDelete(dataStructure)}
              className={'cursor-pointer'}/>
          </>
          }
        </div>
        <div className={'flex flex-col gap-3 items-center'}>
          {/*{dataStructure.isEnecolor ?*/}
          {/*  <div*/}
          {/*    className={'flex justify-center items-center w-[64px] aspect-square rounded-full border-1 border-solid border-gray-600 -mt-1.5'}*/}
          {/*    onClick={() => {*/}
          {/*      !inChapter && router.push(`/structures/${selectedStructFolder?.id}/${dataStructure?.id}`)*/}
          {/*    }}>*/}
          {/*    <img src={iconImg.enecolorIcon} alt={'structure'} width={43} height={60}/>*/}
          {/*  </div>*/}
          {/*  : */}
          <img src={'/icons/data-structure-icon.svg'} alt={'structure'} width={43}
               height={60}
               onClick={() => {
                 !inChapter && router.push(`/structures/${selectedStructFolder?.id}/${dataStructure?.id}`)
               }}
          />
          {/*}*/}
          <TextField
            className={`${inChapter && 'pointer-events-none'}`}
            variant={'outlined'}
            error={idValidate.includes(dataStructure.id)}
            helperText={idValidate.includes(dataStructure.id) ? 'タイトルを入力してください。' : null}
            placeholder={'題名'}
            size={'small'}
            value={name}
            onChange={onchangeName}
            onBlur={onBlurs}
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  )
}

export default ListData
