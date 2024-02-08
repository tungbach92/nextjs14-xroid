import React, {useEffect, useState} from "react";
import Modal from "@/app/components/custom/Modal";
import {Checkbox, FormControlLabel} from "@mui/material";
import {useAtom, useAtomValue} from "jotai";
import {newDataStructureAtom, selectedDataStructureContentAtom,} from "@/app/store/atom/structureData.atom";
import {NewDataStructure} from "@/app/types/types";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import {contentAtom} from "@/app/store/atom/contents.atom";
import {saveError, saveSuccess} from "@/app/services/content";
import {useRouter} from "next/navigation";

interface DataStructureContentModalProps {
  isOpen: boolean,
  toggleClose: () => void
  handleChangeState: (field: string) => (value: any) => void
  loading: boolean
}

export default function DataStructureContentModal({
                                                    isOpen,
                                                    toggleClose,
                                                    handleChangeState,
                                                    loading
                                                  }: DataStructureContentModalProps
) {
  const content = useAtomValue(contentAtom)
  const newDataStructures = useAtomValue(newDataStructureAtom)
  const [selectedDataStructureContent, setSelectedDataStructureContent] = useAtom(selectedDataStructureContentAtom)
  const [data, setData] = useState<NewDataStructure[]>([])
  const router = useRouter()
  const {contentId}: any = router.query;

  useEffect(() => {
    setData(newDataStructures)
  }, [newDataStructures])

  const handleChange = (e) => {
    const id = e.target.id
    const _data = [...data]
    const idx = _data.findIndex(i => i.id === id)
    _data[idx].isCheck = !_data[idx].isCheck
    setData(_data)
  }
  const onSubmit = async () => {
    const _selectedDataStructureContent = data?.filter(data => data.isCheck === true)
    setSelectedDataStructureContent(_selectedDataStructureContent)

    if (contentId === "create") return toggleClose()

    const oldSelectedDataStructureContent = [...selectedDataStructureContent]
    const dataStructureIds = _selectedDataStructureContent.map((data) => data.id);
    if (JSON.stringify(dataStructureIds) === JSON.stringify(content.dataStructureIds)) return toggleClose()

    try {
      handleChangeState("saveLoading")(true);
      const dataStructureIds = _selectedDataStructureContent.map((data) => data.id);
      const _content = {...content, dataStructureIds}
      await updateContent(_content)
      saveSuccess()
      toggleClose()
    } catch (e) {
      console.log(e)
      saveError()
      setSelectedDataStructureContent(oldSelectedDataStructureContent)
      const oldData = newDataStructures.map(item => oldSelectedDataStructureContent.some(o => o.id === item.id) ? ({
        ...item,
        isCheck: true
      }) : ({...item}))
      setData(oldData)
    } finally {
      handleChangeState("saveLoading")(false);
    }
  }

  return (
    <Modal open={isOpen}
           setOpen={toggleClose}
           btnSubmit={'保存'}
           onSubmit={onSubmit}
           handleClose={toggleClose}
           title={'データ構造を選択してください。'}
           loading={loading}
    >
      <div>
        {
          data?.map((item) => {
            return (
              <FormControlLabel
                key={item.id}
                className={'flex gap-2 bg-[#F5F7FB] py-2 min-w-fit my-2 mx-10 rounded-md'}
                control={
                  <Checkbox
                    checked={item.isCheck}
                    onChange={handleChange}
                    id={item.id}
                    color="primary"
                  />
                }
                label={item.name}
              />
            )
          })
        }
      </div>
    </Modal>
  )
}
